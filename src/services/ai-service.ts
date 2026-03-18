/**
 * AI Service Interface — integration point for future AI capabilities.
 *
 * The initial implementation is a no-op stub. Replace StubAIService with
 * a real implementation (e.g., OllamaAIService, ClaudeAIService) when ready.
 */

export interface AIService {
  explainConcept(concept: string, context: string): Promise<string | null>
  generateHint(question: string, previousAttempts: string[]): Promise<string | null>
  assessFreeformAnswer(question: string, answer: string, rubric: string): Promise<{ score: number; feedback: string } | null>
  suggestNextStep(strengths: string[], weaknesses: string[]): Promise<string | null>
  analyzeReflection(entry: string): Promise<{ themes: string[]; sentiment: string } | null>
}

export class StubAIService implements AIService {
  async explainConcept(): Promise<string | null> { return null }
  async generateHint(): Promise<string | null> { return null }
  async assessFreeformAnswer(): Promise<{ score: number; feedback: string } | null> { return null }
  async suggestNextStep(): Promise<string | null> { return null }
  async analyzeReflection(): Promise<{ themes: string[]; sentiment: string } | null> { return null }
}

// Singleton instance — swap this when integrating real AI
export const aiService: AIService = new StubAIService()
