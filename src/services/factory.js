const {GoogleGenerativeAI} = require("@google/generative-ai");
require('dotenv').config();


// init gemini
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({
    model: "gemini-2.5-flash"
});

const generateContent = async(topic , category) =>{
    console.log(`Processing ${topic} for [${category}]...`);

    try{
        let systemInstruction = '';
        if(category === 'lit'){
            systemInstruction = `
            You are a Philosophy & Literature expert.
            Analyze the user's topic.
            Return ONLY raw JSON (no markdown).
            Structure:
            {
                "title": "A Poetic/Deep Title",
                "intro": "One profound sentence (max 20 words).",
                "points": ["Insight 1", "Famous Quote", "Modern Meaning"]
            } such that overall content dont exceed 75 words`;
        }
        else{
            systemInstruction = `
            You are a Senior Tech Engineer.
            Explain the user's topic concisely.
            Return ONLY raw JSON (no markdown).
            Structure:
            {
                "title": "Technical Title",
                "intro": "What problem does it solve? (max 20 words)",
                "points": ["Core Component", "Use Case", "Best Practice"]
            }
            such that overall content dont exceed 75 words.    
            `;
        }

        const prompt = `${systemInstruction}\nTopic: "${topic}"`;
        const result = await model.generateContent(prompt);
        const response = await result.response;
        let text = response.text();

        text = text.replace(/```json/g, '').replace(/```/g, '').trim();

        return JSON.parse(text);
    }
    catch(error){
        console.error("something went wrong:" , error);
        throw new Error("Gemini Generation Failed");
    }
}

module.exports = {generateContent};