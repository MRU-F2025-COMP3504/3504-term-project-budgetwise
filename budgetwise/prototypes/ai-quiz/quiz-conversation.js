const fs = require('fs');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../../.env') });
const OpenAI = require('openai');
const { quizSystemPrompt } = require('./prompts.js');
const readLine = require('readline');


const rl = readLine.createInterface({
    input: process.stdin,
    output: process.stdout
});

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

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
        { role: "system", content: quizSystemPrompt },
        { role: "user", content: "Hi! I'm ready to start the budgeting quiz." }
    ];

    // Initial AI question
    let aiResponse = await getAIResponse(messages);
    console.log("BudgetWise:", aiResponse);

    // Add AI response to history
    messages.push({ role: "assistant", content: aiResponse });

    while (true) {
        // Get user input
        const userInput = await askUser("\nYou: ");

        // Add user input to history
        messages.push({ role: "user", content: userInput });

        // Get AI response
        aiResponse = await getAIResponse(messages);
        console.log("\nBudgetWise:", aiResponse);

        // Add AI response to history
        messages.push({ role: "assistant", content: aiResponse });

        // Check if quiz should end
        if (aiResponse.toLowerCase().includes("summary") ||
           (aiResponse.toLowerCase().includes("profile"))) {
            console.log("\nQuiz ended. Thank you for participating!");

            saveQuizSummary(aiResponse);

            rl.close();
            break;
        }
    }
}

async function getAIResponse(messages) {
    const response = await openai.chat.completions.create({
        model: "gpt-4o",
        messages: messages
    });
    return response.choices[0].message.content;
}

function saveQuizSummary(summary) {
    try {
        // Extract JSON object from the response using regex
        const match = summary.match(/{[\s\S]*}/);
        if (!match) {
            throw new Error("No JSON found in AI response.");
        }
        const jsonSummary = JSON.parse(match[0]);

        // Generate filename with timestamp
        const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
        const filename = `quiz_summary_${timestamp}.json`;

        // Save to file
        fs.writeFileSync(path.join(__dirname, '../user profiles', filename), JSON.stringify(jsonSummary, null, 2));
        console.log(`Quiz summary saved to ${filename}`);
    } catch (error) {
        console.error("Failed to save quiz summary:", error);
    }
}

startQuiz();