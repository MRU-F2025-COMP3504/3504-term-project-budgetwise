/**
 * Shared AI Prompts
 *
 * This file contains the "scripts" we give to the AI so it knows how to act.
 * By keeping them here, we can easily change the AI's personality or instructions
 * without hunting through the whole codebase.
 */

export function generateInsightsPrompt(profile) {
  const {
    monthlyIncome = "N/A",
    monthlyBudget = "N/A",
    savingsGoal = "N/A",
    experienceLevel = "N/A",
    financialGoals = "N/A",
  } = profile;

  return `
    You are a financial advisor. A user has provided their financial profile data.
    
    USER DATA:
    - Monthly Income: $${monthlyIncome}
    - Monthly Budget: $${monthlyBudget}
    - Savings Goal: $${savingsGoal}
    - Experience Level: ${experienceLevel}
    - Financial Goals: ${financialGoals}
    
    TASK:
    1. Generate a "summary": A concise, encouraging, 1-paragraph executive summary of their current financial standing based on these numbers.
    2. Generate "insights": An array of maximum 4 short, actionable, bullet-point style insights or tips specific to their situation.
    
    OUTPUT FORMAT:
    Return ONLY a valid JSON object:
    {
      "summary": "...",
      "insights": ["...", "...", "..."]
    }
  `;
}
