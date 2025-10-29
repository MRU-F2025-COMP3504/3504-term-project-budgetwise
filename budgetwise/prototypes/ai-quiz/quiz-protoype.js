// Loads environment variables from .env file
require('dotenv').config();
// Load OpenAI library
const OPENAI = require('openai');
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});