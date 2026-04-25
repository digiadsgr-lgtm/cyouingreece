import { GoogleGenerativeAI } from '@google/generative-ai';

async function run() {
  try {
    const res = await fetch(`https://generativelanguage.googleapis.com/v1beta/models?key=AIzaSyCj8jvAk_EsSZrnXaYhVToQZBKsIPTFKRw`);
    const data = await res.json();
    if (data.models) {
      console.log('Available models:');
      data.models.forEach((m: any) => console.log(m.name));
    } else {
      console.log('Error data:', data);
    }
  } catch (e: any) {
    console.error('ERROR:', e.message);
  }
}

run();
