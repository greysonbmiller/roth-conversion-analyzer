from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from models import AnalysisRequest, AnalysisResult
from calculator import analyze_roth_conversion

app = FastAPI(title="Roth IRA Conversion Analyzer", version="1.0.0")

# Configure CORS
# Allow localhost for development and any origin for production (requests come through nginx proxy)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://localhost:3000", "http://localhost"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/api/health")
async def health_check():
    """Health check endpoint"""
    return {"status": "healthy", "service": "Roth IRA Conversion Analyzer"}


@app.post("/api/analyze", response_model=AnalysisResult)
async def analyze(request: AnalysisRequest):
    """
    Analyze Roth IRA conversion benefits based on client financial data.
    Returns recommendation and projected outcomes.
    """
    result = analyze_roth_conversion(request)
    return result
