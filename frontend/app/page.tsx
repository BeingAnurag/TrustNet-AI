"use client";

import { useState } from "react";
import type { EvaluateRequest, EvaluateResponse, ApiError } from "./types";

export default function Home() {
  // Form state
  const [question, setQuestion] = useState("");
  const [context, setContext] = useState("");
  const [answer, setAnswer] = useState("");

  // UI state
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<EvaluateResponse | null>(null);

  /**
   * Handle form submission and API call
   */
  const handleEvaluate = async () => {
    // Validate inputs
    if (!question.trim() || !context.trim() || !answer.trim()) {
      setError("Please fill in all fields");
      return;
    }

    setLoading(true);
    setError(null);
    setResult(null);

    try {
      // Get backend URL from environment variable
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8001";
      
      const payload: EvaluateRequest = {
        question: question.trim(),
        context: context.trim(),
        answer: answer.trim(),
      };

      const response = await fetch(`${apiUrl}/evaluate`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const errorData: ApiError = await response.json();
        throw new Error(errorData.detail || "Failed to evaluate answer");
      }

      const raw = await response.json();

      // Normalize backend response shape to UI contract without changing backend
      const weights: Record<string, number> = {
        semantic_similarity: 0.5,
        entity_overlap: 0.3,
        self_consistency: 0.1,
        entropy: 0.1,
      };

      const signalsArray = Array.isArray(raw.signals)
        ? raw.signals
        : Object.entries(raw.signals || {}).map(([name, value]) => ({
            name,
            value: typeof value === "number" ? value : Number(value ?? 0),
            weight: weights[name] ?? 0,
          }));

      const normalized: EvaluateResponse = {
        predicted_label: (raw.predicted_label ?? raw.label) as any,
        trust_score: Number(raw.trust_score ?? 0),
        decision:
          raw.decision ?? (Number(raw.trust_score ?? 0) > 0.8
            ? "show"
            : Number(raw.trust_score ?? 0) >= 0.5
            ? "show_with_warning"
            : "flag"),
        signals: signalsArray,
        question,
        context,
        answer,
      };

      setResult(normalized);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An unexpected error occurred");
    } finally {
      setLoading(false);
    }
  };

  /**
   * UX: Returns decision badge styling with visual indicators (icons, colors)
   * Provides immediate visual feedback for trust level
   */
  const getDecisionConfig = (decision: string) => {
    switch (decision) {
      case "show":
        return {
          badge: "bg-emerald-500 text-white shadow-md",
          icon: "✓",
          label: "Trusted",
          description: "High confidence - safe to display",
          ring: "ring-emerald-200",
        };
      case "show_with_warning":
        return {
          badge: "bg-amber-500 text-white shadow-md",
          icon: "⚠",
          label: "Warning",
          description: "Moderate confidence - review recommended",
          ring: "ring-amber-200",
        };
      case "flag":
        return {
          badge: "bg-red-500 text-white shadow-md",
          icon: "✕",
          label: "Hallucinated",
          description: "Low confidence - likely contains errors",
          ring: "ring-red-200",
        };
      default:
        return {
          badge: "bg-slate-500 text-white shadow-md",
          icon: "?",
          label: "Unknown",
          description: "Unable to determine",
          ring: "ring-slate-200",
        };
    }
  };

  /**
   * UX: Color-codes trust score for instant risk assessment
   */
  const getTrustScoreColor = (score: number) => {
    if (score >= 0.7) return { bg: "bg-emerald-500", text: "text-emerald-700" };
    if (score >= 0.4) return { bg: "bg-amber-500", text: "text-amber-700" };
    return { bg: "bg-red-500", text: "text-red-700" };
  };

  /**
   * UX: Formats signal names to be more user-friendly
   */
  const formatSignalName = (name: string) => {
    return name
      .split("_")
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 dark:from-gray-950 dark:via-indigo-950 dark:to-purple-950">
      {/* UX: Centered container with max width for optimal reading experience */}
      <main className="container mx-auto px-4 py-8 max-w-7xl">
        
        {/* Header with improved hierarchy and visual branding */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-2xl mb-4 shadow-lg">
            <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h1 className="text-5xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent mb-3">
            TrustNet AI
          </h1>
          <p className="text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
            Advanced hallucination detection for LLM-generated content
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
          
          {/* UX: Input section takes 2/5 of space on large screens for balanced layout */}
          <div className="lg:col-span-2">
            <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-xl border border-slate-200 dark:border-slate-700 p-8 sticky top-8">
              <div className="flex items-center mb-6">
                <div className="w-10 h-10 bg-indigo-100 dark:bg-indigo-900/30 rounded-lg flex items-center justify-center mr-3">
                  <svg className="w-5 h-5 text-indigo-600 dark:text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                  </svg>
                </div>
                <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
                  Input
                </h2>
              </div>

              {/* UX: Consistent spacing and visual hierarchy for form fields */}
              <div className="space-y-5">
                
                {/* Question Input */}
                <div>
                  <label 
                    htmlFor="question" 
                    className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2"
                  >
                    Question
                  </label>
                  <textarea
                    id="question"
                    value={question}
                    onChange={(e) => setQuestion(e.target.value)}
                    disabled={loading}
                    className="w-full px-4 py-3 border-2 border-slate-200 dark:border-slate-600 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 dark:bg-slate-700 dark:text-white resize-none transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                    rows={3}
                    placeholder="What question was asked?"
                  />
                </div>

                {/* Context Input */}
                <div>
                  <label 
                    htmlFor="context" 
                    className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2"
                  >
                    Context
                  </label>
                  <textarea
                    id="context"
                    value={context}
                    onChange={(e) => setContext(e.target.value)}
                    disabled={loading}
                    className="w-full px-4 py-3 border-2 border-slate-200 dark:border-slate-600 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 dark:bg-slate-700 dark:text-white resize-none transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                    rows={5}
                    placeholder="Paste the reference context or source material..."
                  />
                </div>

                {/* Answer Input */}
                <div>
                  <label 
                    htmlFor="answer" 
                    className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2"
                  >
                    LLM Answer
                  </label>
                  <textarea
                    id="answer"
                    value={answer}
                    onChange={(e) => setAnswer(e.target.value)}
                    disabled={loading}
                    className="w-full px-4 py-3 border-2 border-slate-200 dark:border-slate-600 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 dark:bg-slate-700 dark:text-white resize-none transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                    rows={4}
                    placeholder="Paste the AI-generated answer to evaluate..."
                  />
                </div>

                {/* UX: Primary action button with clear loading state */}
                <button
                  onClick={handleEvaluate}
                  disabled={loading}
                  className="w-full bg-indigo-600 hover:bg-indigo-700 disabled:bg-slate-400 text-white font-semibold py-4 px-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 disabled:cursor-not-allowed disabled:shadow-none"
                >
                  {loading ? (
                    <span className="flex items-center justify-center">
                      <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Analyzing...
                    </span>
                  ) : (
                    <span className="flex items-center justify-center">
                      <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
                      </svg>
                      Evaluate Answer
                    </span>
                  )}
                </button>

                {/* UX: Error state with clear visual distinction */}
                {error && (
                  <div className="p-4 bg-red-50 dark:bg-red-900/20 border-2 border-red-200 dark:border-red-800 rounded-xl">
                    <div className="flex items-start">
                      <svg className="w-5 h-5 text-red-600 dark:text-red-400 mt-0.5 mr-3 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                      </svg>
                      <p className="text-sm font-medium text-red-800 dark:text-red-300">{error}</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* UX: Results section takes 3/5 of space for detailed output display */}
          <div className="lg:col-span-3">
            <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-xl border border-slate-200 dark:border-slate-700 p-8 min-h-[600px]">
              <div className="flex items-center mb-6">
                <div className="w-10 h-10 bg-purple-100 dark:bg-purple-900/30 rounded-lg flex items-center justify-center mr-3">
                  <svg className="w-5 h-5 text-purple-600 dark:text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                </div>
                <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
                  Analysis Results
                </h2>
              </div>

              {/* UX: Empty state with clear call to action */}
              {!result && !loading && (
                <div className="flex flex-col items-center justify-center h-96 text-center">
                  <div className="w-24 h-24 bg-slate-100 dark:bg-slate-700 rounded-full flex items-center justify-center mb-6">
                    <svg className="w-12 h-12 text-slate-400 dark:text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                  </div>
                  <p className="text-lg font-medium text-slate-600 dark:text-slate-400 mb-2">
                    No results yet
                  </p>
                  <p className="text-sm text-slate-500 dark:text-slate-500 max-w-sm">
                    Fill in the question, context, and answer fields, then click "Evaluate Answer" to see the analysis
                  </p>
                </div>
              )}

              {/* UX: Results display with clear visual hierarchy and color-coded feedback */}
              {result && (
                <div className="space-y-6">
                  
                  {/* UX: Hero metric - Trust Score prominently displayed with radial progress */}
                  <div className={`p-6 rounded-2xl border-2 ${getDecisionConfig(result.decision).ring} bg-gradient-to-br from-white to-slate-50 dark:from-slate-800 dark:to-slate-900 shadow-lg`}>
                    <div className="flex items-center justify-between mb-4">
                      <div>
                        <p className="text-sm font-semibold text-slate-600 dark:text-slate-400 uppercase tracking-wide mb-1">
                          Trust Score
                        </p>
                        <p className="text-5xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                          {(result.trust_score * 100).toFixed(0)}%
                        </p>
                      </div>
                      
                      {/* UX: Decision badge with icon for quick scanning */}
                      <div className="text-right">
                        <div className={`inline-flex items-center px-5 py-2.5 rounded-xl text-base font-bold shadow-lg ${getDecisionConfig(result.decision).badge}`}>
                          <span className="text-2xl mr-2">{getDecisionConfig(result.decision).icon}</span>
                          {getDecisionConfig(result.decision).label}
                        </div>
                        <p className="text-xs text-slate-500 dark:text-slate-400 mt-2 max-w-[200px]">
                          {getDecisionConfig(result.decision).description}
                        </p>
                      </div>
                    </div>
                    
                    {/* UX: Visual progress bar with color coding */}
                    <div className="relative">
                      <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-4 overflow-hidden">
                        <div
                          className={`h-4 rounded-full transition-all duration-1000 ease-out ${getTrustScoreColor(result.trust_score).bg} shadow-lg`}
                          style={{ width: `${result.trust_score * 100}%` }}
                        />
                      </div>
                      {/* UX: Threshold markers for visual reference */}
                      <div className="flex justify-between mt-2 text-xs text-slate-500 dark:text-slate-400">
                        <span>Low</span>
                        <span>Medium</span>
                        <span>High</span>
                      </div>
                    </div>
                  </div>

                  {/* UX: Classification result with clear labeling */}
                  <div className="p-5 bg-slate-50 dark:bg-slate-900/50 rounded-xl border border-slate-200 dark:border-slate-700">
                    <p className="text-xs font-semibold text-slate-600 dark:text-slate-400 uppercase tracking-wide mb-2">
                      Classification
                    </p>
                    <div className="flex items-center">
                      <div className={`w-3 h-3 rounded-full mr-3 ${getTrustScoreColor(result.trust_score).bg}`}></div>
                      <p className="text-xl font-bold text-slate-900 dark:text-white">
                        {formatSignalName(result.predicted_label)}
                      </p>
                    </div>
                  </div>

                  {/* UX: Signal breakdown in professional table format */}
                  <div>
                    <h3 className="text-sm font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wide mb-4 flex items-center">
                      <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                      </svg>
                      Signal Breakdown
                    </h3>
                    <div className="space-y-3">
                      {result.signals.map((signal, index) => (
                        <div 
                          key={index}
                          className="group p-4 bg-white dark:bg-slate-900/50 border border-slate-200 dark:border-slate-700 rounded-xl hover:border-indigo-300 dark:hover:border-indigo-700 transition-all"
                        >
                          <div className="flex justify-between items-start mb-3">
                            <div className="flex-1">
                              <p className="text-sm font-semibold text-slate-900 dark:text-white mb-1">
                                {formatSignalName(signal.name)}
                              </p>
                              <div className="flex items-center space-x-3 text-xs text-slate-500 dark:text-slate-400">
                                <span className="flex items-center">
                                  <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                                    <path d="M2 11a1 1 0 011-1h2a1 1 0 011 1v5a1 1 0 01-1 1H3a1 1 0 01-1-1v-5zM8 7a1 1 0 011-1h2a1 1 0 011 1v9a1 1 0 01-1 1H9a1 1 0 01-1-1V7zM14 4a1 1 0 011-1h2a1 1 0 011 1v12a1 1 0 01-1 1h-2a1 1 0 01-1-1V4z" />
                                  </svg>
                                  Weight: {signal.weight.toFixed(2)}
                                </span>
                              </div>
                            </div>
                            <div className="text-right ml-4">
                              <p className={`text-2xl font-bold ${getTrustScoreColor(signal.value).text}`}>
                                {(signal.value * 100).toFixed(0)}%
                              </p>
                            </div>
                          </div>
                          
                          {/* UX: Mini progress bar for each signal */}
                          <div className="relative">
                            <div className="w-full bg-slate-100 dark:bg-slate-700 rounded-full h-2 overflow-hidden">
                              <div
                                className={`h-2 rounded-full transition-all duration-500 ${getTrustScoreColor(signal.value).bg}`}
                                style={{ width: `${signal.value * 100}%` }}
                              />
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
