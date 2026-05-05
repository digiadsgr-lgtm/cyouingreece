import * as dotenv from 'dotenv';
dotenv.config();
import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || 'AIzaSyBEPIjJZvlHpe7H-cAMccFa9YMoNiQ3Otc');
const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

async function getJSONFromGemini(prompt: string) {
  try {
    const result = await model.generateContent(prompt + "\nReturn ONLY valid JSON. No markdown backticks. No talk.");
    const text = result.response.text().trim();
    console.log("Raw output:\n", text);
    const clean = text.replace(/```json/g, '').replace(/```/g, '').trim();
    return JSON.parse(clean);
  } catch (err: any) {
    console.error("Error:", err.message);
    return null;
  }
}

const validDestinationNames = 'Santorini, Mykonos, Crete, Rhodes, Paros, Naxos';

getJSONFromGemini(`
    Provide practical info for Santorini in JSON:
    - official_website: The official municipality or regional tourism site URL (or null).
    - best_time: One sentence.
    - difficulty: 'Low', 'Medium', or 'High' based on accessibility.
    - youtube_url: Provide a realistic YouTube URL for a high-quality travel documentary or 4K drone video of Santorini. (e.g., https://www.youtube.com/watch?v=...)
    - nearby_destinations: Pick 2-4 EXACT names from this list that are geographically closest or logistically connected to Santorini: [${validDestinationNames}]. Return an array of strings.
  `).then(res => console.log("\nParsed:", res));
