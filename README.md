# Roth IRA Conversion Analyzer

A simple marketing tool to analyze and determine possible benefits of Roth IRA conversions for prospective clients.

## Features

- **FastAPI Backend**: High-performance API for financial calculations
- **React Frontend**: Clean, responsive user interface
- **Comprehensive Analysis**: Tax impact, breakeven analysis, and lifetime projections
- **Simple Input**: Easy-to-use form for collecting client financial data
- **Clear Results**: Visual presentation of recommendations and key metrics

## Project Structure

```
CSI Wealth/
├── backend/                  # FastAPI backend
│   ├── main.py              # Main FastAPI application
│   ├── models.py            # Pydantic data models
│   ├── calculator.py        # Roth conversion calculation logic
│   ├── requirements.txt     # Python dependencies
│   └── .env.example         # Environment variables template
├── frontend/                 # React frontend
│   ├── src/
│   │   ├── App.jsx          # Main React component
│   │   ├── components/      # React components
│   │   ├── api.js           # API client
│   │   └── main.jsx         # Entry point
│   ├── package.json         # Node dependencies
│   └── vite.config.js       # Vite configuration
└── README.md                # This file
```

## Getting Started

### Quick Start (Recommended)

**Dependencies are already installed!** Simply run the startup script:

- **Windows (Command Prompt)**: Double-click `start.bat` or run:
  ```cmd
  start.bat
  ```

- **Windows (PowerShell)**: Right-click `start.ps1` and select "Run with PowerShell" or run:
  ```powershell
  .\start.ps1
  ```

This will automatically start both the backend (http://localhost:8000) and frontend (http://localhost:5173) in separate windows.

### Manual Setup

If you prefer to start each service manually:

#### Prerequisites

- Python 3.8 or higher
- Node.js 18 or higher
- npm or yarn

#### Backend Setup

1. Navigate to the backend directory:
   ```bash
   cd backend
   ```

2. Create a virtual environment:
   ```bash
   python -m venv venv
   ```

3. Activate the virtual environment:
   - Windows: `venv\Scripts\activate`
   - Mac/Linux: `source venv/bin/activate`

4. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```

5. Start the FastAPI server:
   ```bash
   uvicorn main:app --reload
   ```

   The backend will be available at `http://localhost:8000`

### Frontend Setup

1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```

   The frontend will be available at `http://localhost:5173`

## Usage

1. Open your browser and navigate to `http://localhost:5173`
2. Fill out the form with client financial information:
   - Demographics (age, household type, retirement year)
   - Income sources (Social Security, pensions, rental income)
   - Capital (Traditional IRA, Roth IRA, taxable accounts)
3. Click "Analyze Roth Conversion"
4. Review the results and recommendations

## API Endpoints

- `GET /api/health` - Health check endpoint
- `POST /api/analyze` - Analyze Roth IRA conversion benefits

## Calculation Methodology

The analyzer considers:

1. **Current Tax Situation**: Determines marginal tax rate based on current income
2. **Conversion Tax Cost**: Calculates immediate tax impact of converting traditional IRA to Roth
3. **Future Projections**:
   - Traditional IRA with Required Minimum Distributions (RMDs) starting at age 73
   - Roth IRA with tax-free growth and no RMDs
4. **Breakeven Analysis**: Years until Roth conversion benefits exceed costs
5. **Lifetime Tax Savings**: Total projected tax savings over expected lifespan

## Technology Stack

**Backend:**
- FastAPI - Modern, fast web framework
- Pydantic - Data validation and settings management
- Uvicorn - ASGI server

**Frontend:**
- React 18 - UI library
- Vite - Fast build tool and dev server
- Axios - HTTP client

## Notes

- This is a marketing/educational tool, not a production financial planning system
- Tax calculations use 2026 projected federal tax brackets
- Results are estimates based on current tax law and provided assumptions
- Always consult with a qualified financial advisor before making conversion decisions

## License

Proprietary - CSI Wealth
