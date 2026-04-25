const { GoogleGenerativeAI } = require('@google/generative-ai');

async function test() {
  try {
    const genAI = new GoogleGenerativeAI('AIzaSyCj8jvAk_EsSZrnXaYhVToQZBKsIPTFKRw');
    const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash' });
    const chat = model.startChat({
      history: [
        { role: 'user', parts: [{ text: 'Hello' }] },
        { role: 'model', parts: [{ text: 'Hi, I am Nikos' }] }
      ]
    });
    const result = await chat.sendMessageStream('Tell me about Athens');
    
    let full = '';
    for await (const chunk of result.stream) {
      full += chunk.text();
    }
    console.log("Success:", full.substring(0, 50));
  } catch (err) {
    console.error("Error:", err);
  }
}
test();
