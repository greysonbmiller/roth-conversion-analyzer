from models import AnalysisRequest, AnalysisResult
from datetime import datetime


# 2026 Tax Brackets (using projected 2024 brackets adjusted for inflation)
# Note: Single brackets are used for "single", "married_separately", and "head_of_household" filing statuses
# Married brackets are used for "married_jointly" filing status
TAX_BRACKETS_SINGLE = [
    (11600, 0.10),
    (47150, 0.12),
    (100525, 0.22),
    (191950, 0.24),
    (243725, 0.32),
    (609350, 0.35),
    (float('inf'), 0.37)
]

TAX_BRACKETS_MARRIED = [
    (23200, 0.10),
    (94300, 0.12),
    (201050, 0.22),
    (383900, 0.24),
    (487450, 0.32),
    (731200, 0.35),
    (float('inf'), 0.37)
]

# RMD divisors by age (simplified IRS table)
RMD_DIVISORS = {
    73: 26.5, 74: 25.5, 75: 24.6, 76: 23.7, 77: 22.9, 78: 22.0,
    79: 21.1, 80: 20.2, 81: 19.4, 82: 18.5, 83: 17.7, 84: 16.8,
    85: 16.0, 86: 15.2, 87: 14.4, 88: 13.7, 89: 12.9, 90: 12.2,
    91: 11.5, 92: 10.8, 93: 10.1, 94: 9.5, 95: 8.9
}


def calculate_tax(income: float, filing_status: str) -> float:
    """Calculate federal income tax based on brackets"""
    # Use married brackets for married filing jointly, single brackets for all others
    brackets = TAX_BRACKETS_MARRIED if filing_status == "married_jointly" else TAX_BRACKETS_SINGLE

    tax = 0
    previous_limit = 0

    for limit, rate in brackets:
        if income <= previous_limit:
            break
        taxable_in_bracket = min(income, limit) - previous_limit
        tax += taxable_in_bracket * rate
        previous_limit = limit

    return tax


def get_marginal_rate(income: float, filing_status: str) -> float:
    """Get marginal tax rate for given income"""
    # Use married brackets for married filing jointly, single brackets for all others
    brackets = TAX_BRACKETS_MARRIED if filing_status == "married_jointly" else TAX_BRACKETS_SINGLE

    for limit, rate in brackets:
        if income <= limit:
            return rate
    return brackets[-1][1]


def calculate_rmd(balance: float, age: int) -> float:
    """Calculate Required Minimum Distribution"""
    if age < 73:
        return 0

    divisor = RMD_DIVISORS.get(age, 8.0)
    return balance / divisor


def project_traditional_ira(
    initial_balance: float,
    current_age: int,
    longevity: int,
    return_rate: float,
    marginal_rate: float
) -> tuple[float, float]:
    """Project traditional IRA with RMDs and taxes"""
    balance = initial_balance
    total_taxes_paid = 0

    for age in range(current_age, longevity + 1):
        # Apply growth
        balance *= (1 + return_rate)

        # Calculate and withdraw RMD
        if age >= 73:
            rmd = calculate_rmd(balance, age)
            balance -= rmd
            total_taxes_paid += rmd * marginal_rate

    return balance, total_taxes_paid


def project_roth_ira(
    initial_balance: float,
    current_age: int,
    longevity: int,
    return_rate: float
) -> float:
    """Project Roth IRA (tax-free growth, no RMDs)"""
    years = longevity - current_age
    return initial_balance * ((1 + return_rate) ** years)


def analyze_roth_conversion(request: AnalysisRequest) -> AnalysisResult:
    """Main analysis function for Roth conversion"""

    demo = request.demographics
    capital = request.capital

    current_year = datetime.now().year
    filing_status = demo.num_people

    # Determine primary person's age and longevity for analysis
    age = demo.age_person1
    longevity = demo.longevity_person1

    # For married filers, use the longer longevity for projections (survivor benefit)
    if (demo.num_people in ["married_jointly", "married_separately"]) and demo.longevity_person2:
        longevity = max(demo.longevity_person1, demo.longevity_person2)

    # Calculate total traditional IRA balance
    total_traditional_ira = capital.before_tax_ira_person1
    if capital.before_tax_ira_person2:
        total_traditional_ira += capital.before_tax_ira_person2

    # Calculate total existing Roth
    total_existing_roth = capital.roth_person1
    if capital.roth_person2:
        total_existing_roth += capital.roth_person2

    # Calculate weighted average return rates
    traditional_return = capital.return_traditional_person1
    if capital.before_tax_ira_person2 and capital.return_traditional_person2:
        # Weighted average for traditional accounts
        total_trad = capital.before_tax_ira_person1 + capital.before_tax_ira_person2
        if total_trad > 0:
            traditional_return = (
                (capital.before_tax_ira_person1 * capital.return_traditional_person1 +
                 capital.before_tax_ira_person2 * capital.return_traditional_person2) / total_trad
            )

    roth_return = capital.return_roth_person1
    if capital.roth_person2 and capital.return_roth_person2:
        # Weighted average for roth accounts
        total_roth_existing = capital.roth_person1 + capital.roth_person2
        if total_roth_existing > 0:
            roth_return = (
                (capital.roth_person1 * capital.return_roth_person1 +
                 capital.roth_person2 * capital.return_roth_person2) / total_roth_existing
            )

    # Calculate conversion tax cost
    marginal_rate = get_marginal_rate(demo.taxable_income, filing_status)
    conversion_tax_cost = total_traditional_ira * marginal_rate

    # Scenario 1: Keep traditional IRA (with RMDs and taxes)
    traditional_end_value, lifetime_taxes = project_traditional_ira(
        total_traditional_ira,
        age,
        longevity,
        traditional_return,
        marginal_rate
    )

    # Scenario 2: Convert to Roth (tax-free growth)
    amount_after_conversion_tax = total_traditional_ira - conversion_tax_cost
    roth_end_value = project_roth_ira(
        amount_after_conversion_tax + total_existing_roth,
        age,
        longevity,
        roth_return
    )

    # Calculate benefit
    lifetime_tax_savings = (roth_end_value - traditional_end_value - lifetime_taxes)

    # Breakeven calculation (simplified)
    years_to_breakeven = 0
    for year in range(1, 50):
        trad_value = total_traditional_ira * ((1 + traditional_return) ** year)
        roth_value = amount_after_conversion_tax * ((1 + roth_return) ** year)

        if roth_value > trad_value:
            years_to_breakeven = year
            break

    if years_to_breakeven == 0:
        years_to_breakeven = 50

    # Generate recommendation
    key_factors = []

    # Decision logic
    years_until_rmd = max(0, 73 - age)

    if marginal_rate >= 0.24:
        key_factors.append(f"Currently in high tax bracket ({marginal_rate*100:.0f}%)")

    if years_until_rmd > 10:
        key_factors.append(f"{years_until_rmd} years until RMDs begin - more time for tax-free growth")

    if total_traditional_ira > 500000:
        key_factors.append("Large IRA balance will trigger substantial RMDs")

    if longevity - age > 20:
        key_factors.append(f"{longevity - age} year time horizon provides growth opportunity")

    # Determine recommendation
    if lifetime_tax_savings > conversion_tax_cost * 2 and years_to_breakeven < 15:
        recommendation = "strong"
        summary = f"Strong candidate for Roth conversion. You could save approximately ${lifetime_tax_savings:,.0f} in lifetime taxes with a breakeven period of {years_to_breakeven} years."
    elif lifetime_tax_savings > conversion_tax_cost and years_to_breakeven < 25:
        recommendation = "moderate"
        summary = f"Moderate benefit from Roth conversion. Estimated lifetime tax savings of ${lifetime_tax_savings:,.0f} with a breakeven period of {years_to_breakeven} years."
    else:
        recommendation = "not_recommended"
        summary = f"Roth conversion may not be optimal. The breakeven period of {years_to_breakeven} years and lifetime savings of ${lifetime_tax_savings:,.0f} suggest keeping the traditional IRA may be better."
        key_factors.append("Consider partial conversions in lower-income years")

    if not key_factors:
        key_factors.append("Analysis based on current tax rates and assumptions")

    return AnalysisResult(
        recommendation=recommendation,
        summary=summary,
        conversion_tax_cost=conversion_tax_cost,
        breakeven_years=years_to_breakeven,
        lifetime_tax_savings=max(0, lifetime_tax_savings),
        key_factors=key_factors,
        projected_traditional_ira_value=traditional_end_value,
        projected_roth_value=roth_end_value
    )
