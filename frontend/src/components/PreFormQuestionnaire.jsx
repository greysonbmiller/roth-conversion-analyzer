import { useState } from 'react';

function PreFormQuestionnaire({ onComplete }) {
  const [answers, setAnswers] = useState({
    believeTaxesWillIncrease: null,
    legacyAmount: ''
  });

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

  const handleSubmit = (e) => {
    e.preventDefault();
    if (answers.believeTaxesWillIncrease === null || !answers.legacyAmount) {
      alert('Please answer both questions before proceeding.');
      return;
    }
    onComplete(answers);
  };

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      background: 'rgba(0, 0, 0, 0.5)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 9999,
      padding: '20px'
    }}>
      <div style={{
        background: 'white',
        borderRadius: '12px',
        maxWidth: '600px',
        width: '100%',
        padding: '40px',
        boxShadow: '0 20px 60px rgba(0, 0, 0, 0.3)'
      }}>
        <h2 style={{
          marginTop: 0,
          marginBottom: '10px',
          color: '#333',
          fontSize: '1.8rem'
        }}>
          Before We Begin
        </h2>
        <p style={{
          color: '#666',
          marginBottom: '30px',
          fontSize: '1rem',
          lineHeight: '1.5'
        }}>
          Help us understand your goals and expectations to provide a more personalized analysis.
        </p>

        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: '30px' }}>
            <label style={{
              display: 'block',
              fontWeight: 600,
              color: '#333',
              marginBottom: '15px',
              fontSize: '1.05rem'
            }}>
              1. Do you believe that in 10 years and onwards, income taxes will go up?
            </label>
            <div style={{ display: 'flex', gap: '15px' }}>
              <button
                type="button"
                onClick={() => setAnswers({ ...answers, believeTaxesWillIncrease: true })}
                style={{
                  flex: 1,
                  padding: '15px',
                  background: answers.believeTaxesWillIncrease === true ? '#667eea' : 'white',
                  color: answers.believeTaxesWillIncrease === true ? 'white' : '#666',
                  border: answers.believeTaxesWillIncrease === true ? '2px solid #667eea' : '2px solid #ddd',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  fontWeight: answers.believeTaxesWillIncrease === true ? 600 : 400,
                  fontSize: '1rem',
                  transition: 'all 0.2s ease'
                }}
                onMouseEnter={(e) => {
                  if (answers.believeTaxesWillIncrease !== true) {
                    e.currentTarget.style.borderColor = '#667eea';
                    e.currentTarget.style.background = '#f9fafb';
                  }
                }}
                onMouseLeave={(e) => {
                  if (answers.believeTaxesWillIncrease !== true) {
                    e.currentTarget.style.borderColor = '#ddd';
                    e.currentTarget.style.background = 'white';
                  }
                }}
              >
                Yes
              </button>
              <button
                type="button"
                onClick={() => setAnswers({ ...answers, believeTaxesWillIncrease: false })}
                style={{
                  flex: 1,
                  padding: '15px',
                  background: answers.believeTaxesWillIncrease === false ? '#667eea' : 'white',
                  color: answers.believeTaxesWillIncrease === false ? 'white' : '#666',
                  border: answers.believeTaxesWillIncrease === false ? '2px solid #667eea' : '2px solid #ddd',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  fontWeight: answers.believeTaxesWillIncrease === false ? 600 : 400,
                  fontSize: '1rem',
                  transition: 'all 0.2s ease'
                }}
                onMouseEnter={(e) => {
                  if (answers.believeTaxesWillIncrease !== false) {
                    e.currentTarget.style.borderColor = '#667eea';
                    e.currentTarget.style.background = '#f9fafb';
                  }
                }}
                onMouseLeave={(e) => {
                  if (answers.believeTaxesWillIncrease !== false) {
                    e.currentTarget.style.borderColor = '#ddd';
                    e.currentTarget.style.background = 'white';
                  }
                }}
              >
                No
              </button>
            </div>
          </div>

          <div style={{ marginBottom: '35px' }}>
            <label style={{
              display: 'block',
              fontWeight: 600,
              color: '#333',
              marginBottom: '12px',
              fontSize: '1.05rem'
            }}>
              2. How much money from your current 401k/IRA would you like to leave to your kids tax free?
            </label>
            <div style={{ position: 'relative' }}>
              <span style={{
                position: 'absolute',
                left: '15px',
                top: '50%',
                transform: 'translateY(-50%)',
                color: '#666',
                fontSize: '1.1rem',
                fontWeight: 500
              }}>
                $
              </span>
              <input
                type="text"
                value={formatWithCommas(answers.legacyAmount)}
                onChange={(e) => {
                  // Only allow numbers, commas, and one decimal point
                  const cleanedValue = e.target.value.replace(/[^\d,\.]/g, '');
                  // Remove commas before storing the value
                  const unformattedValue = removeCommas(cleanedValue);
                  setAnswers({ ...answers, legacyAmount: unformattedValue });
                }}
                min="0"
                placeholder="Enter amount"
                style={{
                  width: '100%',
                  padding: '15px 15px 15px 35px',
                  border: '2px solid #ddd',
                  borderRadius: '8px',
                  fontSize: '1rem',
                  transition: 'border-color 0.2s ease',
                  boxSizing: 'border-box'
                }}
                onFocus={(e) => e.currentTarget.style.borderColor = '#667eea'}
                onBlur={(e) => e.currentTarget.style.borderColor = '#ddd'}
              />
            </div>
          </div>

          <button
            type="submit"
            style={{
              width: '100%',
              padding: '15px',
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              fontSize: '1.1rem',
              fontWeight: 600,
              cursor: 'pointer',
              transition: 'transform 0.2s ease, box-shadow 0.2s ease',
              boxShadow: '0 4px 12px rgba(102, 126, 234, 0.3)'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-2px)';
              e.currentTarget.style.boxShadow = '0 6px 16px rgba(102, 126, 234, 0.4)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = '0 4px 12px rgba(102, 126, 234, 0.3)';
            }}
          >
            Continue to Analysis
          </button>
        </form>
      </div>
    </div>
  );
}

export default PreFormQuestionnaire;
