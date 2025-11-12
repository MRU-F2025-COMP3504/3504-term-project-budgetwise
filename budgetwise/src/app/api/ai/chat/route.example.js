/**
 * Example AI API Route
 * 
 * This demonstrates how to use the AIHelper in API routes.
 * You can use this pattern for:
 * - /api/ai/chat - General chatbot
 * - /api/ai/advice - Financial advice
 * - /api/quiz - Quiz generation
 */

import { NextResponse } from 'next/server';
import { getAIHelper } from '../../../../lib/helpers/AIHelper';

export async function POST(req) {
  try {
    const { question, context } = await req.json();

    if (!question) {
      return NextResponse.json(
        { error: 'Question is required' },
        { status: 400 }
      );
    }

    // Get singleton AI helper instance
    const ai = getAIHelper();

    // Check token usage before proceeding
    const usage = ai.getUsageStats();
    if (usage.remaining < 100) {
      return NextResponse.json(
        { error: 'AI token limit reached. Please try again later.' },
        { status: 429 }
      );
    }

    // Get AI response with financial context
    const response = await ai.getFinancialAdvice(question, context);

    return NextResponse.json({
      response,
      tokenUsage: ai.getUsageStats(),
    });

  } catch (error) {
    console.error('❌ AI API Error:', error);
    return NextResponse.json(
      { error: error.message || 'AI request failed' },
      { status: 500 }
    );
  }
}

// Optional: GET endpoint to check token usage
export async function GET() {
  const ai = getAIHelper();
  return NextResponse.json({
    usage: ai.getUsageStats(),
  });
}
