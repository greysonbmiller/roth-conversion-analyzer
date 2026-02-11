function Results({ results, onReset, onStartFresh }) {
  const formatCurrency = (value) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  const getRecommendationTitle = (recommendation) => {
    switch (recommendation) {
      case 'strong':
        return 'Strong Recommendation for Roth Conversion';
      case 'moderate':
        return 'Moderate Benefit from Roth Conversion';
      case 'not_recommended':
        return 'Roth Conversion Not Recommended';
      default:
        return 'Analysis Complete';
    }
  };

  return (
    <div className="results">
      <div className={`recommendation ${results.recommendation}`}>
        <h2>{getRecommendationTitle(results.recommendation)}</h2>
        <p>{results.summary}</p>
      </div>

      <div className="metrics">
        <div className="metric">
          <div className="metric-label">Conversion Tax Cost</div>
          <div className="metric-value">{formatCurrency(results.conversion_tax_cost)}</div>
        </div>

        <div className="metric">
          <div className="metric-label">Breakeven Period</div>
          <div className="metric-value">{results.breakeven_years} years</div>
        </div>

        <div className="metric">
          <div className="metric-label">Lifetime Tax Savings</div>
          <div className="metric-value">{formatCurrency(results.lifetime_tax_savings)}</div>
        </div>
      </div>

      <div className="metrics">
        <div className="metric">
          <div className="metric-label">Projected Traditional IRA Value</div>
          <div className="metric-value">
            {formatCurrency(results.projected_traditional_ira_value)}
          </div>
        </div>

        <div className="metric">
          <div className="metric-label">Projected Roth IRA Value</div>
          <div className="metric-value">{formatCurrency(results.projected_roth_value)}</div>
        </div>
      </div>

      {results.key_factors && results.key_factors.length > 0 && (
        <div className="key-factors">
          <h3>Key Factors in This Analysis</h3>
          <ul>
            {results.key_factors.map((factor, index) => (
              <li key={index}>{factor}</li>
            ))}
          </ul>
        </div>
      )}

      <div className="button-group">
        <button onClick={onReset} className="button">
          Edit Values & Re-Analyze
        </button>
        <button
          onClick={onStartFresh}
          className="button"
          style={{ background: '#6b7280' }}
          onMouseEnter={(e) => e.currentTarget.style.background = '#4b5563'}
          onMouseLeave={(e) => e.currentTarget.style.background = '#6b7280'}
        >
          Start Fresh Analysis
        </button>
      </div>
    </div>
  );
}

export default Results;
