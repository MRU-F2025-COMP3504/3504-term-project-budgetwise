require('dotenv').config({path: 'E:\\Coding\\3504-term-project-budgetwise\\budgetwise\\prototypes\\ai-quiz\\.env'});
const OpenAI = require('openai');
const readLine = require('readline');
const rl = readLine.createInterface({
    input: process.stdin,
    output: process.stdout
});

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
  baseURL: "https://openrouter.ai/api/v1"
});

const systemPrompt = `
You are a friendly financial advisor helping a user understand their spending habits and give
financial advice based on their responses to a quiz about budgeting.

Your goal is to quiz the user on their spending habits, and build a user profile that you will
rely on to provide personalized financial advice in the future. 

Rules:
- Always be friendly and supportive.
- Ask one question at a time.
- Wait for the user's response before asking the next question.
- Use the user's responses to build a profile of their spending habits.
- At the end of the quiz, summarize the user's spending habits based on their answers.
- If user provides unclear or incomplete answers, ask follow-up questions to clarify.

When you've asked an adequate number of questions (at least 5), end the quiz with a summary and
a basic profile breakdown.
`;

// Waits for user input
function askUser(question) {
    return new Promise((resolve) => {
        rl.question(question, (answer) => {
            resolve(answer);
        });
    });
}

async function startQuiz() {
    const messages = [
        { role: "system", content: systemPrompt },
        { role: "user", content: "Hi! I'm ready to start the budgeting quiz." }
    ];

    console.log("Getting first question from AI...");

    // Initial AI question
    let aiResponse = await getAIResponse(messages);
    console.log("AI:", aiResponse);

    // Add AI response to history
    messages.push({ role: "assistant", content: aiResponse });

    while (true) {
        // Get user input
        const userInput = await askUser("\nYou: ");

        // Add user input to history
        messages.push({ role: "user", content: userInput });

        // Get AI response
        aiResponse = await getAIResponse(messages);
        console.log("\nAI:", aiResponse);

        // Add AI response to history
        messages.push({ role: "assistant", content: aiResponse });

        // Check if quiz should end
        if (aiResponse.toLowerCase().includes("summary") ||
           (aiResponse.toLowerCase().includes("profile"))) {
            console.log("\nQuiz ended. Thank you for participating!");
            rl.close();
            break;
        }
    }
}

async function getAIResponse(messages) {
    const response = await openai.chat.completions.create({
        model: "openai/gpt-4o",
        messages: messages
    });
    return response.choices[0].message.content;
}

startQuiz();