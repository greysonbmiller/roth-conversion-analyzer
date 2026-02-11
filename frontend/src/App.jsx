import { useState } from 'react';
import InputForm from './components/InputForm';
import Results from './components/Results';
import PreFormQuestionnaire from './components/PreFormQuestionnaire';

function App() {
  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [resetKey, setResetKey] = useState(0);
  const [formData, setFormData] = useState(null);
  const [questionnaireCompleted, setQuestionnaireCompleted] = useState(false);
  const [questionnaireAnswers, setQuestionnaireAnswers] = useState(null);

  const handleAnalysisComplete = (analysisResults, submittedFormData) => {
    setResults(analysisResults);
    setFormData(submittedFormData);
    setLoading(false);
  };

  const handleAnalysisStart = () => {
    setLoading(true);
    setError(null);
  };

  const handleError = (errorMessage) => {
    setError(errorMessage);
    setLoading(false);
  };

  const handleReset = () => {
    setResults(null);
    setError(null);
    // Keep formData so it's preserved when going back to form
  };

  const handleStartFresh = () => {
    setResults(null);
    setError(null);
    setFormData(null);
    setQuestionnaireCompleted(false);
    setQuestionnaireAnswers(null);
    setResetKey(prev => prev + 1); // Force InputForm to remount with fresh state
  };

  const handleQuestionnaireComplete = (answers) => {
    setQuestionnaireAnswers(answers);
    setQuestionnaireCompleted(true);
  };

  return (
    <div className="app">
      {!questionnaireCompleted && !results && (
        <PreFormQuestionnaire onComplete={handleQuestionnaireComplete} />
      )}

      <div className="header">
        <h1>Roth IRA Conversion Analyzer</h1>
        <p>Discover if a Roth conversion could benefit your retirement strategy</p>
      </div>

      <div className="card">
        {error && (
          <div className="error">
            <strong>Error:</strong> {error}
          </div>
        )}

        {loading && (
          <div className="loading">
            Analyzing your financial situation...
          </div>
        )}

        {!results && !loading && questionnaireCompleted && (
          <InputForm
            key={resetKey}
            initialData={formData}
            questionnaireAnswers={questionnaireAnswers}
            onAnalysisComplete={handleAnalysisComplete}
            onAnalysisStart={handleAnalysisStart}
            onError={handleError}
          />
        )}

        {results && !loading && (
          <Results
            results={results}
            onReset={handleReset}
            onStartFresh={handleStartFresh}
          />
        )}
      </div>
    </div>
  );
}

export default App;
