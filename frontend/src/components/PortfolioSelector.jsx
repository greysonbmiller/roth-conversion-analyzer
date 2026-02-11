import { useState } from 'react';

const ALLOCATIONS = [
  { stocks: 100, bonds: 0, return: 0.10, label: '100% Stocks' },
  { stocks: 80, bonds: 20, return: 0.09, label: '80/20' },
  { stocks: 60, bonds: 40, return: 0.08, label: '60/40' },
  { stocks: 50, bonds: 50, return: 0.07, label: '50/50' },
  { stocks: 40, bonds: 60, return: 0.06, label: '40/60' },
  { stocks: 20, bonds: 80, return: 0.05, label: '20/80' },
  { stocks: 0, bonds: 100, return: 0.04, label: '100% Bonds' },
];

function PieChartIcon({ stocks, bonds, selected }) {
  const size = 36;
  const radius = 15;
  const centerX = size / 2;
  const centerY = size / 2;

  // Calculate the pie chart path for stocks percentage
  const getArcPath = (percentage) => {
    if (percentage === 0) return '';
    if (percentage === 100) {
      return `M ${centerX},${centerY} m 0,-${radius} a ${radius},${radius} 0 1,1 0,${radius * 2} a ${radius},${radius} 0 1,1 0,-${radius * 2}`;
    }

    const angle = (percentage / 100) * 2 * Math.PI;
    const x = centerX + radius * Math.sin(angle);
    const y = centerY - radius * Math.cos(angle);
    const largeArc = percentage > 50 ? 1 : 0;

    return `M ${centerX},${centerY} L ${centerX},${centerY - radius} A ${radius},${radius} 0 ${largeArc},1 ${x},${y} Z`;
  };

  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
      {/* Background circle (bonds) */}
      <circle
        cx={centerX}
        cy={centerY}
        r={radius}
        fill="#93c5fd"
        stroke={selected ? '#667eea' : '#e0e0e0'}
        strokeWidth={selected ? 2.5 : 1.5}
      />
      {/* Foreground pie slice (stocks) */}
      {stocks > 0 && (
        <path
          d={getArcPath(stocks)}
          fill="#10b981"
          stroke="none"
        />
      )}
    </svg>
  );
}

function PortfolioSelector({ value, onChange, label }) {
  const selectedAllocation = ALLOCATIONS.find(a => a.stocks === value) || ALLOCATIONS[2];

  const handleSelect = (allocation) => {
    onChange(allocation.stocks, allocation.return);
  };

  return (
    <div style={{ flex: 1, minWidth: 0, marginBottom: '30px' }}>
      {label && (
        <label style={{
          display: 'block',
          fontWeight: 600,
          color: '#555',
          marginBottom: '12px'
        }}>
          {label}
        </label>
      )}
      <div style={{
        display: 'flex',
        gap: '6px',
        flexWrap: 'nowrap',
        alignItems: 'center',
        width: '100%',
        justifyContent: 'space-between'
      }}>
        {ALLOCATIONS.map((allocation) => (
          <button
            key={allocation.stocks}
            type="button"
            onClick={() => handleSelect(allocation)}
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '4px',
              padding: '6px 4px',
              background: value === allocation.stocks ? '#f0f4ff' : 'white',
              border: value === allocation.stocks ? '2px solid #667eea' : '2px solid #e0e0e0',
              borderRadius: '6px',
              cursor: 'pointer',
              transition: 'all 0.2s ease',
              minWidth: '55px',
              flex: '1 1 0'
            }}
            onMouseEnter={(e) => {
              if (value !== allocation.stocks) {
                e.currentTarget.style.borderColor = '#667eea';
                e.currentTarget.style.background = '#f9fafb';
              }
            }}
            onMouseLeave={(e) => {
              if (value !== allocation.stocks) {
                e.currentTarget.style.borderColor = '#e0e0e0';
                e.currentTarget.style.background = 'white';
              }
            }}
          >
            <PieChartIcon
              stocks={allocation.stocks}
              bonds={allocation.bonds}
              selected={value === allocation.stocks}
            />
            <span style={{
              fontSize: '10px',
              fontWeight: value === allocation.stocks ? 600 : 400,
              color: value === allocation.stocks ? '#667eea' : '#666',
              whiteSpace: 'nowrap'
            }}>
              {allocation.label}
            </span>
            <span style={{
              fontSize: '9px',
              color: '#999',
              whiteSpace: 'nowrap'
            }}>
            </span>
          </button>
        ))}
      </div>
    </div>
  );
}

export default PortfolioSelector;
