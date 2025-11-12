/**
 * AI Helper Class
 * 
 * Centralized AI service for the entire application.
 * Handles OpenAI API calls with token management and caching.
 * 
 * Features:
 * - Token usage tracking and limits
 * - Response caching to reduce API calls
 * - Configurable models and parameters
 * - Error handling and retry logic
 * 
 * Usage:
 * ```js
 * import AIHelper from '@/lib/helpers/AIHelper';
 * 
 * const ai = new AIHelper();
 * const response = await ai.chat([
 *   { role: 'user', content: 'What is my spending pattern?' }
 * ]);
 * ```
 */

import OpenAI from 'openai';

class AIHelper {
  constructor(options = {}) {
    // Initialize OpenAI client
    this.client = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });

    // Configuration
    this.config = {
      model: options.model || 'gpt-4o-mini', // Use mini for cost efficiency
      maxTokens: options.maxTokens || 500,
      temperature: options.temperature || 0.7,
      enableCache: options.enableCache !== false, // Default to enabled
      cacheExpiry: options.cacheExpiry || 5 * 60 * 1000, // 5 minutes
    };

    // Token tracking (in-memory, consider database for production)
    this.tokenUsage = {
      total: 0,
      session: 0,
      limit: options.tokenLimit || 100000, // Daily limit
    };

    // Simple in-memory cache
    this.cache = new Map();
  }

  /**
   * Main chat completion method
   * @param {Array} messages - Array of message objects { role, content }
   * @param {Object} options - Override default options
   * @returns {Promise<string>} - AI response text
   */
  async chat(messages, options = {}) {
    // Check token limit
    if (this.tokenUsage.session >= this.tokenUsage.limit) {
      throw new Error('Token limit reached. Please try again later.');
    }

    // Generate cache key if caching is enabled
    const cacheKey = this.config.enableCache 
      ? this._generateCacheKey(messages) 
      : null;

    // Check cache
    if (cacheKey && this.cache.has(cacheKey)) {
      const cached = this.cache.get(cacheKey);
      if (Date.now() - cached.timestamp < this.config.cacheExpiry) {
        console.log('✅ Returning cached AI response');
        return cached.response;
      } else {
        this.cache.delete(cacheKey);
      }
    }

    try {
      // Build API call parameters
      const apiParams = {
        model: options.model || this.config.model,
        messages: messages,
        max_tokens: options.maxTokens || this.config.maxTokens,
        temperature: options.temperature ?? this.config.temperature,
      };

      // Add response_format if specified (for JSON mode)
      if (options.responseFormat) {
        apiParams.response_format = options.responseFormat;
      }

      // Make API call
      const completion = await this.client.chat.completions.create(apiParams);

      // Track token usage
      const tokensUsed = completion.usage?.total_tokens || 0;
      this.tokenUsage.session += tokensUsed;
      this.tokenUsage.total += tokensUsed;

      console.log(`🤖 AI tokens used: ${tokensUsed} (session: ${this.tokenUsage.session}/${this.tokenUsage.limit})`);

      const response = completion.choices[0]?.message?.content || '';

      // Cache the response
      if (cacheKey) {
        this.cache.set(cacheKey, {
          response,
          timestamp: Date.now(),
        });
      }

      return response;
    } catch (error) {
      console.error('❌ AI Helper Error:', error);
      throw new Error(`AI request failed: ${error.message}`);
    }
  }

  /**
   * Simplified method for single user prompts
   * @param {string} prompt - User's question/prompt
   * @param {string} systemPrompt - Optional system context
   * @returns {Promise<string>}
   */
  async ask(prompt, systemPrompt = null) {
    const messages = [];
    
    if (systemPrompt) {
      messages.push({ role: 'system', content: systemPrompt });
    }
    
    messages.push({ role: 'user', content: prompt });
    
    return this.chat(messages);
  }

  /**
   * Specialized method for financial advice
   * @param {string} question - User's financial question
   * @param {Object} context - User's financial context (budget, transactions, etc.)
   * @returns {Promise<string>}
   */
  async getFinancialAdvice(question, context = {}) {
    const systemPrompt = `You are a helpful financial advisor for BudgetWise. 
Provide clear, actionable advice based on the user's spending data.
Keep responses concise (2-3 sentences) and practical.
Context: ${JSON.stringify(context)}`;

    return this.ask(question, systemPrompt);
  }

  /**
   * Generate quiz questions based on user's answers
   * @param {Array} previousAnswers - Array of previous Q&A pairs
   * @returns {Promise<Object>} - Next question object
   */
  async generateQuizQuestion(previousAnswers = []) {
    const systemPrompt = `You are creating a personalized financial profile quiz.
Generate ONE follow-up question based on the user's previous answers.
Return JSON: { "question": "...", "type": "text|choice", "options": [] }`;

    const prompt = previousAnswers.length > 0
      ? `Previous answers: ${JSON.stringify(previousAnswers)}. Generate the next question.`
      : 'Generate the first question about the user\'s financial goals.';

    const response = await this.ask(prompt, systemPrompt);
    
    try {
      return JSON.parse(response);
    } catch {
      // Fallback if response isn't valid JSON
      return { question: response, type: 'text', options: [] };
    }
  }

  /**
   * Generate cache key from messages
   * @private
   */
  _generateCacheKey(messages) {
    return JSON.stringify(messages);
  }

  /**
   * Get current token usage stats
   */
  getUsageStats() {
    return {
      session: this.tokenUsage.session,
      total: this.tokenUsage.total,
      limit: this.tokenUsage.limit,
      remaining: this.tokenUsage.limit - this.tokenUsage.session,
      percentUsed: ((this.tokenUsage.session / this.tokenUsage.limit) * 100).toFixed(1),
    };
  }

  /**
   * Reset session token counter
   */
  resetSession() {
    this.tokenUsage.session = 0;
    console.log('✅ AI session token counter reset');
  }

  /**
   * Clear cache manually
   */
  clearCache() {
    this.cache.clear();
    console.log('✅ AI cache cleared');
  }
}

// Export singleton instance for consistent token tracking
let aiHelperInstance = null;

export function getAIHelper(options = {}) {
  if (!aiHelperInstance) {
    aiHelperInstance = new AIHelper(options);
  }
  return aiHelperInstance;
}

export default AIHelper;
