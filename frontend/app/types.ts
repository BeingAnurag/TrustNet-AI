/**
 * Request payload for the /evaluate endpoint
 */
export interface EvaluateRequest {
  question: string;
  context: string;
  answer: string;
}

/**
 * Individual signal result from the evaluation
 */
export interface Signal {
  name: string;
  value: number;
  weight: number;
}

/**
 * Response from the /evaluate endpoint
 */
export interface EvaluateResponse {
  predicted_label: "grounded" | "partially_grounded" | "hallucinated";
  trust_score: number;
  decision: "show" | "show_with_warning" | "flag";
  signals: Signal[];
  question: string;
  context: string;
  answer: string;
}

/**
 * Error response from the API
 */
export interface ApiError {
  detail: string;
}
