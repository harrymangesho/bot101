
import React, { useState, useCallback } from 'react';
import { ImageUploader } from './components/ImageUploader';
import { AnalysisDisplay } from './components/AnalysisDisplay';
import { ChartIcon } from './components/icons/ChartIcon';
import { SparklesIcon } from './components/icons/SparklesIcon';
import { analyzeChart } from './services/geminiService';
import type { AnalysisResult } from './types';

export default function App(): React.ReactNode {
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [analysis, setAnalysis] = useState<AnalysisResult | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const handleAnalyze = useCallback(async () => {
    if (!imageFile) {
      setError('Please upload an image first.');
      return;
    }
    setIsLoading(true);
    setError(null);
    setAnalysis(null);

    try {
      const result = await analyzeChart(imageFile);
      setAnalysis(result);
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('An unknown error occurred.');
      }
    } finally {
      setIsLoading(false);
    }
  }, [imageFile]);

  return (
    <div className="min-h-screen bg-gray-900 text-gray-200 font-sans">
      <div className="container mx-auto p-4 md:p-8">
        <header className="text-center mb-8 md:mb-12">
          <div className="flex items-center justify-center gap-4">
            <ChartIcon className="w-10 h-10 text-cyan-400" />
            <h1 className="text-3xl md:text-4xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 to-purple-500">
              Gemini TA Chart Analyst
            </h1>
          </div>
          <p className="mt-2 text-gray-400 max-w-2xl mx-auto">
            Upload a financial chart image and get an instant, AI-powered technical analysis.
          </p>
        </header>

        <main className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="flex flex-col gap-6 p-6 bg-gray-800/50 border border-gray-700 rounded-2xl shadow-lg">
            <h2 className="text-xl font-semibold text-white">1. Upload Chart Image</h2>
            <ImageUploader onFileSelect={setImageFile} />
            <button
              onClick={handleAnalyze}
              disabled={!imageFile || isLoading}
              className="w-full flex items-center justify-center gap-2 bg-cyan-600 hover:bg-cyan-700 disabled:bg-gray-600 disabled:cursor-not-allowed text-white font-bold py-3 px-4 rounded-lg transition-all duration-300 transform hover:scale-105 disabled:scale-100 focus:outline-none focus:ring-4 focus:ring-cyan-500/50"
            >
              {isLoading ? (
                <>
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Analyzing...
                </>
              ) : (
                <>
                  <SparklesIcon className="w-5 h-5" />
                  Analyze Chart
                </>
              )}
            </button>
          </div>
          <div className="p-6 bg-gray-800/50 border border-gray-700 rounded-2xl shadow-lg min-h-[400px] flex flex-col justify-center">
            <h2 className="text-xl font-semibold text-white mb-4">2. Analysis Result</h2>
            {isLoading && (
              <div className="flex flex-col items-center justify-center text-center text-gray-400">
                <svg className="animate-spin h-10 w-10 text-cyan-500 mb-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                <p className="font-semibold text-lg">Processing your chart...</p>
                <p className="text-sm">This may take a moment.</p>
              </div>
            )}
            {error && (
              <div className="text-center text-red-400 bg-red-900/30 p-4 rounded-lg">
                <h3 className="font-bold">Analysis Failed</h3>
                <p>{error}</p>
              </div>
            )}
            {!isLoading && !error && analysis && <AnalysisDisplay result={analysis} />}
            {!isLoading && !error && !analysis && (
              <div className="text-center text-gray-500">
                <p>Results will appear here after analysis.</p>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}
