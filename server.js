// To run this server:
// 1. Make sure you have Node.js installed.
// 2. In your terminal, run: npm install express @google/generative-ai dotenv cors
// 3. Create a file named ".env" in the same directory.
// 4. Add your API key to the .env file: GEMINI_API_KEY=YOUR_API_KEY_HERE
// 5. Run the server: node server.js
// 6. Open your main HTML file in your browser.

const express = require('express');
const { GoogleGenerativeAI } = require('@google/generative-ai');
const cors = require('cors');
require('dotenv').config();

const app = express();
const port = 3000;

// --- Use CORS middleware ---
app.use(cors());

// Middleware to parse JSON bodies
app.use(express.json());
// Serve static files (like your index.html and other assets)
app.use(express.static('.'));

// Define the API endpoint that the frontend will call
app.post('/api/generate-portfolio', async (req, res) => {
    try {
        // Check for API Key
        if (!process.env.GEMINI_API_KEY) {
            console.error('FATAL: GEMINI_API_KEY is not set in the .env file.');
            return res.status(500).json({ message: 'Server configuration error: The API key is missing.' });
        }

        const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
        const { resumeText } = req.body;
        if (!resumeText) {
            return res.status(400).json({ message: 'Resume text is required.' });
        }

        const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash-preview-05-20" });
        
        const prompt = `Parse the following resume text into a JSON object. The JSON should strictly follow this schema. Do not add any extra fields. If a section is not present, use an empty string or an empty array.
        - name: string
        - email: string
        - phone: string
        - linkedin: string (full URL)
        - github: string (full URL)
        - website: string (full URL)
        - summary: string
        - experience: array of objects with keys "title", "company", "dates", "description" (array of strings)
        - projects: array of objects with keys "name", "description", "link" (full URL), "technologies" (array of strings)
        - education: array of objects with keys "degree", "institution", "dates"
        - skills: array of strings

        Resume Text:
        ---
        ${resumeText}
        ---
        `;
        
        const result = await model.generateContent(prompt);
        const response = await result.response;
        let text = response.text();

        // --- ENHANCED JSON CLEANING ---
        // Use a regular expression to find the JSON block, which is more reliable.
        const jsonRegex = /```json\s*([\s\S]*?)\s*```/;
        const match = text.match(jsonRegex);
        
        let jsonString;
        if (match && match[1]) {
            jsonString = match[1];
        } else {
            // Fallback for cases where the AI doesn't use markdown code blocks
            const startIndex = text.indexOf('{');
            const endIndex = text.lastIndexOf('}');
            if (startIndex !== -1 && endIndex !== -1) {
                jsonString = text.substring(startIndex, endIndex + 1);
            } else {
                console.error("Could not find a valid JSON object in the AI's response. Raw text:", text);
                throw new Error("The AI returned a response that did not contain a valid JSON object.");
            }
        }
        
        let portfolioData;
        try {
            portfolioData = JSON.parse(jsonString);
        } catch (parseError) {
            console.error("Failed to parse JSON from AI response. The raw JSON string was:", jsonString);
            console.error("Original parsing error:", parseError);
            throw new Error("The AI returned a malformed JSON response. See server console for details.");
        }

        // Send the parsed JSON data directly to the frontend.
        res.json(portfolioData);

    } catch (error) {
        console.error('Error processing request:', error.message);
        res.status(500).json({ message: error.message || 'Failed to generate portfolio from the server.' });
    }
});

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
    console.log('Make sure to have your HTML files in the same directory.');
});
