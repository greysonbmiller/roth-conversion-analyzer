import { useState } from 'react';
import { analyzeRothConversion } from '../api';
import PortfolioSelector from './PortfolioSelector';
import Tooltip from './Tooltip';

function InputForm({ initialData, questionnaireAnswers, onAnalysisComplete, onAnalysisStart, onError }) {
  const currentYear = new Date().getFullYear();

  const getInitialFormData = () => {
    if (initialData) {
      return initialData;
    }
    return {
    // Demographics
    num_people: 'single',
    age_person1: '',
    age_person2: '',
    longevity_person1: '',
    longevity_person2: '',
    retirement_year_person1: '',
    retirement_year_person2: '',
    taxable_income: '',

    // Income Sources - Person 1
    social_security_person1: '',
    social_security_start_age_person1: '',
    pension_person1: '',
    pension_cola_person1: false,
    pension_survivorship_person1: '',

    // Income Sources - Person 2
    social_security_person2: '',
    social_security_start_age_person2: '',
    pension_person2: '',
    pension_cola_person2: false,
    pension_survivorship_person2: '',

    // Household Income
    rental_income: '',
    other_income: '',

    // Capital - After-Tax Taxable Per Person
    bank_accounts_person1: '',
    brokerage_non_retirement_person1: '',
    crypto_person1: '',
    precious_metals_person1: '',
    bank_accounts_person2: '',
    brokerage_non_retirement_person2: '',
    crypto_person2: '',
    precious_metals_person2: '',

    // Capital - After-Tax Taxable Household
    emergency_fund: '',
    large_purchases: '',

    // Capital - Retirement Accounts Balances
    before_tax_ira_person1: '',
    before_tax_ira_person2: '',
    roth_person1: '',
    roth_person2: '',

    // Capital - Portfolio Allocations (keep defaults for icon selectors)
    allocation_traditional_person1: 60,
    return_traditional_person1: 0.08,
    allocation_traditional_person2: 60,
    return_traditional_person2: 0.08,
    allocation_roth_person1: 60,
    return_roth_person1: 0.08,
    allocation_roth_person2: 60,
    return_roth_person2: 0.08,
    };
  };

  const [formData, setFormData] = useState(getInitialFormData);

  // Helper function to format number with commas
  const formatWithCommas = (value) => {
    if (!value) return '';
    // Remove any existing commas and non-digit characters except decimal point
    const numStr = value.toString().replace(/,/g, '');
    const parts = numStr.split('.');
    // Add commas to the integer part
    parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    return parts.join('.');
  };

  // Helper function to remove commas from formatted string
  const removeCommas = (value) => {
    if (!value) return '';
    return value.toString().replace(/,/g, '');
  };

  // Fields that should have comma formatting (exclude age, longevity, year, and percentage fields)
  const formattedFields = [
    'taxable_income',
    'social_security_person1',
    'social_security_person2',
    'pension_person1',
    'pension_person2',
    'rental_income',
    'other_income',
    'bank_accounts_person1',
    'bank_accounts_person2',
    'brokerage_non_retirement_person1',
    'brokerage_non_retirement_person2',
    'crypto_person1',
    'crypto_person2',
    'precious_metals_person1',
    'precious_metals_person2',
    'emergency_fund',
    'large_purchases',
    'before_tax_ira_person1',
    'before_tax_ira_person2',
    'roth_person1',
    'roth_person2'
  ];

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    if (type === 'checkbox') {
      setFormData({
        ...formData,
        [name]: checked,
      });
    } else if (formattedFields.includes(name)) {
      // Only allow numbers, commas, and one decimal point
      const cleanedValue = value.replace(/[^\d,\.]/g, '');
      // Remove commas before storing the value
      const unformattedValue = removeCommas(cleanedValue);
      setFormData({
        ...formData,
        [name]: unformattedValue,
      });
    } else {
      setFormData({
        ...formData,
        [name]: value,
      });
    }
  };

  const handlePortfolioChange = (accountType, allocation, returnRate) => {
    setFormData({
      ...formData,
      [`allocation_${accountType}`]: allocation,
      [`return_${accountType}`]: returnRate,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    onAnalysisStart();

    try {
      // Build the request payload
      const payload = {
        demographics: {
          num_people: formData.num_people,
          age_person1: parseInt(formData.age_person1),
          age_person2: formData.num_people === 'couple' && formData.age_person2
            ? parseInt(formData.age_person2)
            : null,
          longevity_person1: parseInt(formData.longevity_person1),
          longevity_person2: formData.num_people === 'couple' && formData.longevity_person2
            ? parseInt(formData.longevity_person2)
            : null,
          retirement_year_person1: parseInt(formData.retirement_year_person1),
          retirement_year_person2: formData.num_people === 'couple' && formData.retirement_year_person2
            ? parseInt(formData.retirement_year_person2)
            : null,
          taxable_income: parseFloat(formData.taxable_income),
        },
        income: {
          social_security_person1: parseFloat(formData.social_security_person1) || 0,
          social_security_start_age_person1: formData.social_security_person1 > 0
            ? parseInt(formData.social_security_start_age_person1)
            : null,
          pension_person1: parseFloat(formData.pension_person1) || 0,
          pension_cola_person1: formData.pension_cola_person1,
          pension_survivorship_person1: parseFloat(formData.pension_survivorship_person1) || 0,

          social_security_person2: formData.num_people === 'couple' && formData.social_security_person2
            ? parseFloat(formData.social_security_person2)
            : null,
          social_security_start_age_person2: formData.num_people === 'couple' && formData.social_security_person2 > 0
            ? parseInt(formData.social_security_start_age_person2)
            : null,
          pension_person2: formData.num_people === 'couple' && formData.pension_person2
            ? parseFloat(formData.pension_person2)
            : null,
          pension_cola_person2: formData.num_people === 'couple' ? formData.pension_cola_person2 : null,
          pension_survivorship_person2: formData.num_people === 'couple' && formData.pension_survivorship_person2
            ? parseFloat(formData.pension_survivorship_person2)
            : null,

          rental_income: parseFloat(formData.rental_income) || 0,
          inheritances: [],
          other_income: parseFloat(formData.other_income) || 0,
        },
        capital: {
          bank_accounts_person1: parseFloat(formData.bank_accounts_person1) || 0,
          brokerage_non_retirement_person1: parseFloat(formData.brokerage_non_retirement_person1) || 0,
          crypto_person1: parseFloat(formData.crypto_person1) || 0,
          precious_metals_person1: parseFloat(formData.precious_metals_person1) || 0,

          bank_accounts_person2: formData.num_people === 'couple' && formData.bank_accounts_person2
            ? parseFloat(formData.bank_accounts_person2)
            : null,
          brokerage_non_retirement_person2: formData.num_people === 'couple' && formData.brokerage_non_retirement_person2
            ? parseFloat(formData.brokerage_non_retirement_person2)
            : null,
          crypto_person2: formData.num_people === 'couple' && formData.crypto_person2
            ? parseFloat(formData.crypto_person2)
            : null,
          precious_metals_person2: formData.num_people === 'couple' && formData.precious_metals_person2
            ? parseFloat(formData.precious_metals_person2)
            : null,

          emergency_fund: parseFloat(formData.emergency_fund) || 0,
          large_purchases: parseFloat(formData.large_purchases) || 0,

          before_tax_ira_person1: parseFloat(formData.before_tax_ira_person1) || 0,
          before_tax_ira_person2: formData.num_people === 'couple' && formData.before_tax_ira_person2
            ? parseFloat(formData.before_tax_ira_person2)
            : null,
          roth_person1: parseFloat(formData.roth_person1) || 0,
          roth_person2: formData.num_people === 'couple' && formData.roth_person2
            ? parseFloat(formData.roth_person2)
            : null,

          allocation_traditional_person1: parseInt(formData.allocation_traditional_person1),
          return_traditional_person1: parseFloat(formData.return_traditional_person1),
          allocation_traditional_person2: formData.num_people === 'couple'
            ? parseInt(formData.allocation_traditional_person2)
            : null,
          return_traditional_person2: formData.num_people === 'couple'
            ? parseFloat(formData.return_traditional_person2)
            : null,
          allocation_roth_person1: parseInt(formData.allocation_roth_person1),
          return_roth_person1: parseFloat(formData.return_roth_person1),
          allocation_roth_person2: formData.num_people === 'couple'
            ? parseInt(formData.allocation_roth_person2)
            : null,
          return_roth_person2: formData.num_people === 'couple'
            ? parseFloat(formData.return_roth_person2)
            : null,
        },
      };

      const results = await analyzeRothConversion(payload);
      onAnalysisComplete(results, formData);
    } catch (err) {
      onError(err.response?.data?.detail || 'Failed to analyze. Please check your inputs and try again.');
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="form-section">
        <h2>
          Demographics
          <Tooltip text="Basic personal information used to model your financial timeline and tax situation." />
        </h2>

        <div className="form-group">
          <label>
            Household Type
            <Tooltip text="Select your filing status. 'Married/Couple' uses joint tax brackets and allows entering data for both spouses separately." />
          </label>
          <select name="num_people" value={formData.num_people} onChange={handleChange}>
            <option value="single">Single</option>
            <option value="couple">Married/Couple</option>
          </select>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label>
              Your Age
              <Tooltip text="Your current age. Used to calculate time until RMDs, project account growth, and determine optimal conversion timing." />
            </label>
            <input
              type="number"
              name="age_person1"
              value={formData.age_person1}
              onChange={handleChange}
              min="18"
              max="100"
              required
            />
          </div>

          {formData.num_people === 'couple' && (
            <div className="form-group">
              <label>
                Spouse Age
                <Tooltip text="Spouse's current age. Used to calculate time until RMDs, project account growth, and determine optimal conversion timing." />
              </label>
              <input
                type="number"
                name="age_person2"
                value={formData.age_person2}
                onChange={handleChange}
                min="18"
                max="100"
              />
            </div>
          )}
        </div>

        <div className="form-row">
          <div className="form-group">
            <label>
              {formData.num_people === 'couple' ? 'Your Expected Longevity' : 'Expected Longevity'}
              <Tooltip text="Expected lifespan. Used to project total account values and tax savings over your lifetime. Consider family history and health factors." />
            </label>
            <input
              type="number"
              name="longevity_person1"
              value={formData.longevity_person1}
              onChange={handleChange}
              min="60"
              max="120"
              required
            />
          </div>

          {formData.num_people === 'couple' && (
            <div className="form-group">
              <label>
                Spouse Expected Longevity
                <Tooltip text="Expected lifespan. Used to project total account values and tax savings over your lifetime. Consider family history and health factors." />
              </label>
              <input
                type="number"
                name="longevity_person2"
                value={formData.longevity_person2}
                onChange={handleChange}
                min="60"
                max="120"
              />
            </div>
          )}
        </div>

        <div className="form-row">
          <div className="form-group">
            <label>
              {formData.num_people === 'couple' ? 'Your Retirement Year' : 'Retirement Year'}
              <Tooltip text="Year when you plan to retire or have already retired. Retirement timing affects income levels and optimal conversion strategy." />
            </label>
            <input
              type="number"
              name="retirement_year_person1"
              value={formData.retirement_year_person1}
              onChange={handleChange}
              min="1950"
              max="2100"
              required
            />
          </div>

          {formData.num_people === 'couple' && (
            <div className="form-group">
              <label>
                Spouse Retirement Year
                <Tooltip text="Year when you plan to retire or have already retired. Retirement timing affects income levels and optimal conversion strategy." />
              </label>
              <input
                type="number"
                name="retirement_year_person2"
                value={formData.retirement_year_person2}
                onChange={handleChange}
                min="1950"
                max="2100"
              />
            </div>
          )}
        </div>

        <div className="form-group">
          <label>
            Current Taxable Income (from 1040)
            <Tooltip text="Your total taxable income from Form 1040. This determines your current marginal tax bracket and the tax cost of converting traditional IRA assets to Roth." />
          </label>
          <input
            type="text"
            name="taxable_income"
            value={formatWithCommas(formData.taxable_income)}
            onChange={handleChange}
            min="0"
            required
          />
        </div>
      </div>

      <div className="form-section">
        <h2>
          Income Sources
          <Tooltip text="Your expected income streams in retirement. Total income affects tax brackets and optimal conversion amounts." />
        </h2>

        <div className="form-row">
          <div className="form-group">
            <label>
              {formData.num_people === 'couple' ? 'Your Annual Social Security ($)' : 'Annual Social Security ($)'}
              <Tooltip text="Expected annual Social Security benefit. Social Security income is partially taxable and affects your overall tax bracket. Delaying benefits increases your monthly payment." />
            </label>
            <input
              type="text"
              name="social_security_person1"
              value={formatWithCommas(formData.social_security_person1)}
              onChange={handleChange}
              min="0"
            />
          </div>

          {formData.num_people === 'couple' && (
            <div className="form-group">
              <label>
                Spouse Annual Social Security ($)
                <Tooltip text="Expected annual Social Security benefit. Social Security income is partially taxable and affects your overall tax bracket. Delaying benefits increases your monthly payment." />
              </label>
              <input
                type="text"
                name="social_security_person2"
                value={formatWithCommas(formData.social_security_person2)}
                onChange={handleChange}
                min="0"
              />
            </div>
          )}
        </div>

        <div className="form-row">
          <div className="form-group">
            <label>
              {formData.num_people === 'couple' ? 'Your Social Security Start Age' : 'Social Security Start Age'}
              <Tooltip text="Age when you plan to begin receiving Social Security. You can start as early as 62 (reduced benefit) or delay until 70 (maximum benefit)." />
            </label>
            <input
              type="number"
              name="social_security_start_age_person1"
              value={formData.social_security_start_age_person1}
              onChange={handleChange}
              min="62"
              max="70"
            />
          </div>

          {formData.num_people === 'couple' && (
            <div className="form-group">
              <label>
                Spouse Social Security Start Age
                <Tooltip text="Age when you plan to begin receiving Social Security. You can start as early as 62 (reduced benefit) or delay until 70 (maximum benefit)." />
              </label>
              <input
                type="number"
                name="social_security_start_age_person2"
                value={formData.social_security_start_age_person2}
                onChange={handleChange}
                min="62"
                max="70"
              />
            </div>
          )}
        </div>

        <div className="form-row">
          <div className="form-group">
            <label>
              {formData.num_people === 'couple' ? 'Your Annual Pension ($)' : 'Annual Pension ($)'}
              <Tooltip text="Annual pension income from employer-sponsored defined benefit plans. Pension income is fully taxable as ordinary income." />
            </label>
            <input
              type="text"
              name="pension_person1"
              value={formatWithCommas(formData.pension_person1)}
              onChange={handleChange}
              min="0"
            />
          </div>

          {formData.num_people === 'couple' && (
            <div className="form-group">
              <label>
                Spouse Annual Pension ($)
                <Tooltip text="Annual pension income from employer-sponsored defined benefit plans. Pension income is fully taxable as ordinary income." />
              </label>
              <input
                type="text"
                name="pension_person2"
                value={formatWithCommas(formData.pension_person2)}
                onChange={handleChange}
                min="0"
              />
            </div>
          )}
        </div>

        <div className="form-row">
          <div className="form-group">
            <label>
              {formData.num_people === 'couple' ? 'Your Pension Has Cost of Living Adjustment (COLA)?' : 'Pension Has Cost of Living Adjustment (COLA)?'}
              <Tooltip text="Whether your pension includes automatic annual increases to keep pace with inflation. COLA pensions maintain purchasing power over time." />
            </label>
            <div style={{ display: 'flex', gap: '10px', marginTop: '8px' }}>
              <button
                type="button"
                onClick={() => setFormData({ ...formData, pension_cola_person1: true })}
                style={{
                  flex: 1,
                  padding: '10px',
                  background: formData.pension_cola_person1 ? '#667eea' : 'white',
                  color: formData.pension_cola_person1 ? 'white' : '#666',
                  border: formData.pension_cola_person1 ? '2px solid #667eea' : '2px solid #ddd',
                  borderRadius: '6px',
                  cursor: 'pointer',
                  fontWeight: formData.pension_cola_person1 ? 600 : 400,
                  transition: 'all 0.2s ease'
                }}
              >
                Yes
              </button>
              <button
                type="button"
                onClick={() => setFormData({ ...formData, pension_cola_person1: false })}
                style={{
                  flex: 1,
                  padding: '10px',
                  background: !formData.pension_cola_person1 ? '#667eea' : 'white',
                  color: !formData.pension_cola_person1 ? 'white' : '#666',
                  border: !formData.pension_cola_person1 ? '2px solid #667eea' : '2px solid #ddd',
                  borderRadius: '6px',
                  cursor: 'pointer',
                  fontWeight: !formData.pension_cola_person1 ? 600 : 400,
                  transition: 'all 0.2s ease'
                }}
              >
                No
              </button>
            </div>
          </div>

          {formData.num_people === 'couple' && (
            <div className="form-group">
              <label>
                Spouse Pension Has Cost of Living Adjustment (COLA)?
                <Tooltip text="Whether your pension includes automatic annual increases to keep pace with inflation. COLA pensions maintain purchasing power over time." />
              </label>
              <div style={{ display: 'flex', gap: '10px', marginTop: '8px' }}>
                <button
                  type="button"
                  onClick={() => setFormData({ ...formData, pension_cola_person2: true })}
                  style={{
                    flex: 1,
                    padding: '10px',
                    background: formData.pension_cola_person2 ? '#667eea' : 'white',
                    color: formData.pension_cola_person2 ? 'white' : '#666',
                    border: formData.pension_cola_person2 ? '2px solid #667eea' : '2px solid #ddd',
                    borderRadius: '6px',
                    cursor: 'pointer',
                    fontWeight: formData.pension_cola_person2 ? 600 : 400,
                    transition: 'all 0.2s ease'
                  }}
                >
                  Yes
                </button>
                <button
                  type="button"
                  onClick={() => setFormData({ ...formData, pension_cola_person2: false })}
                  style={{
                    flex: 1,
                    padding: '10px',
                    background: !formData.pension_cola_person2 ? '#667eea' : 'white',
                    color: !formData.pension_cola_person2 ? 'white' : '#666',
                    border: !formData.pension_cola_person2 ? '2px solid #667eea' : '2px solid #ddd',
                    borderRadius: '6px',
                    cursor: 'pointer',
                    fontWeight: !formData.pension_cola_person2 ? 600 : 400,
                    transition: 'all 0.2s ease'
                  }}
                >
                  No
                </button>
              </div>
            </div>
          )}
        </div>

        <div className="form-row">
          <div className="form-group">
            <label>
              {formData.num_people === 'couple' ? 'Your Pension Survivorship Benefit (%)' : 'Pension Survivorship Benefit (%)'}
              <Tooltip text="Percentage of your pension that continues to your surviving spouse after your death. Common options are 0% (single life), 50%, 75%, or 100% (joint and survivor). Higher survivorship reduces initial monthly payment." />
            </label>
            <input
              type="number"
              name="pension_survivorship_person1"
              value={formData.pension_survivorship_person1}
              onChange={handleChange}
              min="0"
              max="100"
              placeholder="0-100"
            />
          </div>

          {formData.num_people === 'couple' && (
            <div className="form-group">
              <label>
                Spouse Pension Survivorship Benefit (%)
                <Tooltip text="Percentage of your pension that continues to your surviving spouse after your death. Common options are 0% (single life), 50%, 75%, or 100% (joint and survivor). Higher survivorship reduces initial monthly payment." />
              </label>
              <input
                type="number"
                name="pension_survivorship_person2"
                value={formData.pension_survivorship_person2}
                onChange={handleChange}
                min="0"
                max="100"
                placeholder="0-100"
              />
            </div>
          )}
        </div>

        <h3 style={{ fontSize: '1.1rem', color: '#666', marginTop: '25px', marginBottom: '15px' }}>
          Household Income
          <Tooltip text="Shared income sources that apply to the household level, regardless of which spouse earns them." />
        </h3>

        <div className="form-row">
          <div className="form-group">
            <label>
              Annual Rental Income (Net) ($)
              <Tooltip text="Net rental income after expenses (mortgage, taxes, insurance, maintenance). Rental income is taxable and can affect your tax bracket." />
            </label>
            <input
              type="text"
              name="rental_income"
              value={formatWithCommas(formData.rental_income)}
              onChange={handleChange}
              min="0"
            />
          </div>

          <div className="form-group">
            <label>
              Other Annual Income ($)
              <Tooltip text="Any other taxable income sources not listed elsewhere, such as business income, interest, dividends, or capital gains." />
            </label>
            <input
              type="text"
              name="other_income"
              value={formatWithCommas(formData.other_income)}
              onChange={handleChange}
              min="0"
            />
          </div>
        </div>
      </div>

      <div className="form-section">
        <h2>
          Capital & Retirement Accounts
          <Tooltip text="Your investment and retirement account balances. Different account types have different tax treatments which significantly impact Roth conversion analysis." />
        </h2>

        <h3 style={{ fontSize: '1.1rem', color: '#666', marginBottom: '15px' }}>
          After-Tax Taxable Assets
          <Tooltip text="Assets you've already paid taxes on. Interest, dividends, and capital gains from these accounts are taxable annually." />
        </h3>

        <div className="form-row">
          <div className="form-group">
            <label>
              {formData.num_people === 'couple' ? 'Your Bank Accounts (Savings, Checking, CD, Money Market) ($)' : 'Bank Accounts (Savings, Checking, CD, Money Market) ($)'}
              <Tooltip text="Liquid cash holdings in savings, checking, CDs, and money market accounts. Interest earned is taxable annually." />
            </label>
            <input
              type="text"
              name="bank_accounts_person1"
              value={formatWithCommas(formData.bank_accounts_person1)}
              onChange={handleChange}
              min="0"
            />
          </div>

          {formData.num_people === 'couple' && (
            <div className="form-group">
              <label>
                Spouse Bank Accounts (Savings, Checking, CD, Money Market) ($)
                <Tooltip text="Liquid cash holdings in savings, checking, CDs, and money market accounts. Interest earned is taxable annually." />
              </label>
              <input
                type="text"
                name="bank_accounts_person2"
                value={formatWithCommas(formData.bank_accounts_person2)}
                onChange={handleChange}
                min="0"
              />
            </div>
          )}
        </div>

        <div className="form-row">
          <div className="form-group">
            <label>
              {formData.num_people === 'couple' ? 'Your Brokerage & Mutual Funds (Non-Retirement) ($)' : 'Brokerage & Mutual Funds (Non-Retirement) ($)'}
              <Tooltip text="Non-retirement investment accounts including taxable brokerage accounts, mutual funds in individual/joint/trust names. Capital gains are taxed when realized." />
            </label>
            <input
              type="text"
              name="brokerage_non_retirement_person1"
              value={formatWithCommas(formData.brokerage_non_retirement_person1)}
              onChange={handleChange}
              min="0"
            />
          </div>

          {formData.num_people === 'couple' && (
            <div className="form-group">
              <label>
                Spouse Brokerage & Mutual Funds (Non-Retirement) ($)
                <Tooltip text="Non-retirement investment accounts including taxable brokerage accounts, mutual funds in individual/joint/trust names. Capital gains are taxed when realized." />
              </label>
              <input
                type="text"
                name="brokerage_non_retirement_person2"
                value={formatWithCommas(formData.brokerage_non_retirement_person2)}
                onChange={handleChange}
                min="0"
              />
            </div>
          )}
        </div>

        <div className="form-row">
          <div className="form-group">
            <label>
              {formData.num_people === 'couple' ? 'Your Cryptocurrency Holdings ($)' : 'Cryptocurrency Holdings ($)'}
              <Tooltip text="Current market value of cryptocurrency holdings (Bitcoin, Ethereum, etc.). Crypto is treated as property by the IRS, with capital gains tax on sales or exchanges." />
            </label>
            <input
              type="text"
              name="crypto_person1"
              value={formatWithCommas(formData.crypto_person1)}
              onChange={handleChange}
              min="0"
            />
          </div>

          {formData.num_people === 'couple' && (
            <div className="form-group">
              <label>
                Spouse Cryptocurrency Holdings ($)
                <Tooltip text="Current market value of cryptocurrency holdings (Bitcoin, Ethereum, etc.). Crypto is treated as property by the IRS, with capital gains tax on sales or exchanges." />
              </label>
              <input
                type="text"
                name="crypto_person2"
                value={formatWithCommas(formData.crypto_person2)}
                onChange={handleChange}
                min="0"
              />
            </div>
          )}
        </div>

        <div className="form-row">
          <div className="form-group">
            <label>
              {formData.num_people === 'couple' ? 'Your Precious Metals ($)' : 'Precious Metals ($)'}
              <Tooltip text="Market value of physical precious metals (gold, silver, platinum, palladium). Collectibles and precious metals are subject to higher capital gains tax rates (28% max) when sold." />
            </label>
            <input
              type="text"
              name="precious_metals_person1"
              value={formatWithCommas(formData.precious_metals_person1)}
              onChange={handleChange}
              min="0"
            />
          </div>

          {formData.num_people === 'couple' && (
            <div className="form-group">
              <label>
                Spouse Precious Metals ($)
                <Tooltip text="Market value of physical precious metals (gold, silver, platinum, palladium). Collectibles and precious metals are subject to higher capital gains tax rates (28% max) when sold." />
              </label>
              <input
                type="text"
                name="precious_metals_person2"
                value={formatWithCommas(formData.precious_metals_person2)}
                onChange={handleChange}
                min="0"
              />
            </div>
          )}
        </div>

        <h3 style={{ fontSize: '1.1rem', color: '#666', marginTop: '25px', marginBottom: '15px' }}>
          Household Capital Exclusions
          <Tooltip text="Funds that should not be considered for Roth conversion analysis because they're reserved for specific near-term needs." />
        </h3>

        <div className="form-row">
          <div className="form-group">
            <label>
              Emergency Fund to Exclude ($)
              <Tooltip text="Amount set aside as emergency reserves (typically 3-6 months of expenses). These funds should remain liquid and not be used for conversion tax payments." />
            </label>
            <input
              type="text"
              name="emergency_fund"
              value={formatWithCommas(formData.emergency_fund)}
              onChange={handleChange}
              min="0"
            />
          </div>

          <div className="form-group">
            <label>
              Money Set Aside for Large Purchases (Next 5 Years) ($)
              <Tooltip text="Funds earmarked for known upcoming expenses like home purchase, vehicle, education, or other major expenditures within 5 years." />
            </label>
            <input
              type="text"
              name="large_purchases"
              value={formatWithCommas(formData.large_purchases)}
              onChange={handleChange}
              min="0"
            />
          </div>
        </div>

        {/* Traditional IRA/401k Section */}
        <div style={{
          background: 'linear-gradient(to right, #eff6ff, #dbeafe)',
          padding: '20px',
          borderRadius: '8px',
          marginTop: '25px',
          marginBottom: '20px',
          border: '2px solid #93c5fd',
          maxWidth: formData.num_people === 'single' ? '600px' : '100%',
          transition: 'max-width 0.3s ease'
        }}>
          <h3 style={{
            fontSize: '1.2rem',
            color: '#1e40af',
            marginBottom: '15px',
            fontWeight: 600
          }}>
            Traditional IRA/401k (Pre-Tax)
            <Tooltip text="Pre-tax retirement accounts where contributions reduced your taxable income. Withdrawals are fully taxable as ordinary income. Subject to Required Minimum Distributions (RMDs) starting at age 73." />
          </h3>

          <div className="form-row">
            <div className="form-group">
              <label>
                Your Traditional IRA/401k ($)
                <Tooltip text="Total balance in traditional IRA, 401k, 403b, 457, SEP-IRA, or SIMPLE IRA accounts. These are the primary candidates for Roth conversion." />
              </label>
              <input
                type="text"
                name="before_tax_ira_person1"
                value={formatWithCommas(formData.before_tax_ira_person1)}
                onChange={handleChange}
                min="0"
                required
              />
            </div>

            {formData.num_people === 'couple' && (
              <div className="form-group">
                <label>
                  Spouse Traditional IRA/401k ($)
                  <Tooltip text="Total balance in traditional IRA, 401k, 403b, 457, SEP-IRA, or SIMPLE IRA accounts. These are the primary candidates for Roth conversion." />
                </label>
                <input
                  type="text"
                  name="before_tax_ira_person2"
                  value={formatWithCommas(formData.before_tax_ira_person2)}
                  onChange={handleChange}
                  min="0"
                />
              </div>
            )}
          </div>

          <div className="form-row" style={{ alignItems: 'flex-start' }}>
            <PortfolioSelector
              value={formData.allocation_traditional_person1}
              onChange={(allocation, returnRate) => handlePortfolioChange('traditional_person1', allocation, returnRate)}
              label={formData.num_people === 'couple' ? 'Your Traditional IRA/401k Portfolio Allocation' : 'Traditional IRA/401k Portfolio Allocation'}
            />

            {formData.num_people === 'couple' && (
              <PortfolioSelector
                value={formData.allocation_traditional_person2}
                onChange={(allocation, returnRate) => handlePortfolioChange('traditional_person2', allocation, returnRate)}
                label="Spouse Traditional IRA/401k Portfolio Allocation"
              />
            )}
          </div>
        </div>

        {/* Roth IRA/401k Section */}
        <div style={{
          background: 'linear-gradient(to right, #f0fdf4, #dcfce7)',
          padding: '20px',
          borderRadius: '8px',
          marginBottom: '20px',
          border: '2px solid #86efac',
          maxWidth: formData.num_people === 'single' ? '600px' : '100%',
          transition: 'max-width 0.3s ease'
        }}>
          <h3 style={{
            fontSize: '1.2rem',
            color: '#15803d',
            marginBottom: '15px',
            fontWeight: 600
          }}>
            Roth IRA/401k (Tax-Free)
            <Tooltip text="After-tax retirement accounts where contributions were made with already-taxed dollars. Qualified withdrawals (after age 59½ and account open 5+ years) are completely tax-free. No RMDs required during owner's lifetime." />
          </h3>

          <div className="form-row">
            <div className="form-group">
              <label>
                Your Roth IRA/401k ($)
                <Tooltip text="Total balance in Roth IRA, Roth 401k, or Roth 403b accounts. These grow tax-free and have no required distributions during your lifetime." />
              </label>
              <input
                type="text"
                name="roth_person1"
                value={formatWithCommas(formData.roth_person1)}
                onChange={handleChange}
                min="0"
              />
            </div>

            {formData.num_people === 'couple' && (
              <div className="form-group">
                <label>
                  Spouse Roth IRA/401k ($)
                  <Tooltip text="Total balance in Roth IRA, Roth 401k, or Roth 403b accounts. These grow tax-free and have no required distributions during your lifetime." />
                </label>
                <input
                  type="text"
                  name="roth_person2"
                  value={formatWithCommas(formData.roth_person2)}
                  onChange={handleChange}
                  min="0"
                />
              </div>
            )}
          </div>

          <div className="form-row" style={{ alignItems: 'flex-start' }}>
            <PortfolioSelector
              value={formData.allocation_roth_person1}
              onChange={(allocation, returnRate) => handlePortfolioChange('roth_person1', allocation, returnRate)}
              label={formData.num_people === 'couple' ? 'Your Roth IRA/401k Portfolio Allocation' : 'Roth IRA/401k Portfolio Allocation'}
            />

            {formData.num_people === 'couple' && (
              <PortfolioSelector
                value={formData.allocation_roth_person2}
                onChange={(allocation, returnRate) => handlePortfolioChange('roth_person2', allocation, returnRate)}
                label="Spouse Roth IRA/401k Portfolio Allocation"
              />
            )}
          </div>
        </div>
      </div>

      <div className="button-group">
        <button type="submit" className="button">
          Analyze Roth Conversion
        </button>
      </div>
    </form>
  );
}

export default InputForm;
