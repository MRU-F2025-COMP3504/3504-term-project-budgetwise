// Loads environment variables from .env file
require('dotenv').config({path: 'E:\\Coding\\3504-term-project-budgetwise\\budgetwise\\prototypes\\ai-quiz\\.env'});
// Load OpenAI library

// Test if API key is loaded correctly, prints to console
console.log('API Key loaded:', process.env.OPENAI_API_KEY ? 'Yes' : 'No');
console.log('First 10 chars:', process.env.OPENAI_API_KEY?.substring(0, 10));

const OpenAI = require('openai');
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
  baseURL: "https://openrouter.ai/api/v1"
});

async function testAPI() {
  // API call goes here
  const response = await openai.chat.completions.create({
    model: "openai/gpt-4o",
    messages: [
      {
        role: "user",
        content: "Say hello!"
      }
    ]
  });

  console.log(response.choices[0].message.content);
}

testAPI();

