from pydantic import BaseModel, Field
from typing import Optional, Literal, List


class Demographics(BaseModel):
    num_people: Literal["single", "couple"]
    age_person1: int = Field(ge=18, le=100)
    age_person2: Optional[int] = Field(None, ge=18, le=100)
    longevity_person1: int = Field(default=90, ge=60, le=120)
    longevity_person2: Optional[int] = Field(None, ge=60, le=120)
    retirement_year_person1: int = Field(ge=1950, le=2100)
    retirement_year_person2: Optional[int] = Field(None, ge=1950, le=2100)
    taxable_income: float = Field(ge=0)


class Inheritance(BaseModel):
    amount: float = Field(ge=0)
    year: int = Field(ge=2024, le=2100)


class IncomeSources(BaseModel):
    # Person 1 Income
    social_security_person1: float = Field(default=0, ge=0)
    social_security_start_age_person1: Optional[int] = Field(None, ge=62, le=70)
    pension_person1: float = Field(default=0, ge=0)
    pension_cola_person1: bool = Field(default=False)
    pension_survivorship_person1: float = Field(default=0, ge=0, le=100)

    # Person 2 Income (for couples)
    social_security_person2: Optional[float] = Field(None, ge=0)
    social_security_start_age_person2: Optional[int] = Field(None, ge=62, le=70)
    pension_person2: Optional[float] = Field(None, ge=0)
    pension_cola_person2: Optional[bool] = Field(None)
    pension_survivorship_person2: Optional[float] = Field(None, ge=0, le=100)

    # Household Income
    rental_income: float = Field(default=0, ge=0)
    inheritances: List[Inheritance] = Field(default_factory=list)
    other_income: float = Field(default=0, ge=0)


class Capital(BaseModel):
    # After-Tax Taxable - Per Person
    bank_accounts_person1: float = Field(default=0, ge=0)
    brokerage_non_retirement_person1: float = Field(default=0, ge=0)
    crypto_person1: float = Field(default=0, ge=0)
    precious_metals_person1: float = Field(default=0, ge=0)
    bank_accounts_person2: Optional[float] = Field(None, ge=0)
    brokerage_non_retirement_person2: Optional[float] = Field(None, ge=0)
    crypto_person2: Optional[float] = Field(None, ge=0)
    precious_metals_person2: Optional[float] = Field(None, ge=0)

    # After-Tax Taxable - Household Level
    emergency_fund: float = Field(default=0, ge=0)
    large_purchases: float = Field(default=0, ge=0)

    # Retirement Accounts - Balances
    before_tax_ira_person1: float = Field(default=0, ge=0)
    before_tax_ira_person2: Optional[float] = Field(None, ge=0)
    roth_person1: float = Field(default=0, ge=0)
    roth_person2: Optional[float] = Field(None, ge=0)

    # Retirement Accounts - Portfolio Allocations (stocks percentage)
    allocation_traditional_person1: int = Field(default=60, ge=0, le=100)
    return_traditional_person1: float = Field(default=0.08, ge=0, le=0.30)
    allocation_traditional_person2: Optional[int] = Field(None, ge=0, le=100)
    return_traditional_person2: Optional[float] = Field(None, ge=0, le=0.30)
    allocation_roth_person1: int = Field(default=60, ge=0, le=100)
    return_roth_person1: float = Field(default=0.08, ge=0, le=0.30)
    allocation_roth_person2: Optional[int] = Field(None, ge=0, le=100)
    return_roth_person2: Optional[float] = Field(None, ge=0, le=0.30)


class AnalysisRequest(BaseModel):
    demographics: Demographics
    income: IncomeSources
    capital: Capital


class AnalysisResult(BaseModel):
    recommendation: Literal["strong", "moderate", "not_recommended"]
    summary: str
    conversion_tax_cost: float
    breakeven_years: int
    lifetime_tax_savings: float
    key_factors: List[str]
    projected_traditional_ira_value: float
    projected_roth_value: float
