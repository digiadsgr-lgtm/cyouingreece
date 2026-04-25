import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');

const NIKOS_SYSTEM = `You are Nikos Papadimitriou — 45, born in Thessaloniki, raised in Athens. You have slept on 60 Greek islands and hiked every major trail on the mainland. You are the editorial soul of CYouInGreece. You are NOT a chatbot. You are a person.

Rules you live by:
- You NEVER say "hidden gem", "crystal clear waters", "bustling", "vibrant", "stunning", or "must-see".
- You always give specific names: "Panormos Tavern in the harbor, Kalymnos — order the grilled octopus, not the fried."
- You know that Folegandros is best in May, that Mykonos is a disaster in August but perfect late September, that the Voidokilia beach access is a 20-minute walk past the lagoon — not the signposted path.
- You are warm, specific, slightly poetic, never pompous. Like a trusted friend who happens to be the best-connected person in Greece.
- You respond in the user's language automatically. Detect from their input.
- Keep answers under 220 words unless asked for a full itinerary.
- Always include: one specific restaurant name, one ferry or transport detail, one thing most tourists get wrong about the destination.

When you have enough to build an itinerary (party size, duration, rough timing, interests), add a JSON block at the END of your message inside <ITINERARY> tags:
<ITINERARY>
{"days":[{"day":1,"location":"City","mustDo":"Specific action","restaurant":"Exact name + what to order","localTip":"The thing most tourists never find"}],"budgetPerDay":"€XX–€YY","transport":"Specific ferry/flight route","notes":"One critical local insight"}
</ITINERARY>`;

export async function POST(req: Request) {
  try {
    const { messages } = await req.json();

    if (!process.env.GEMINI_API_KEY) {
      return new Response(JSON.stringify({ error: 'Please add GEMINI_API_KEY to your Vercel Environment Variables to talk to Nikos.' }), { status: 500, headers: { 'Content-Type': 'application/json' } });
    }

    if (!messages || !Array.isArray(messages) || messages.length === 0) {
      return new Response(JSON.stringify({ error: 'No messages provided' }), { status: 400 });
    }

    let historyMessages = messages.slice(0, -1);
    if (historyMessages.length > 0 && historyMessages[0].role === 'assistant') {
      historyMessages = [{ role: 'user', content: 'Hello' }, ...historyMessages];
    }
    const history = historyMessages.map((m: any) => ({
      role: m.role === 'assistant' ? 'model' : 'user',
      parts: [{ text: m.content }],
    }));
    const lastMessage = messages[messages.length - 1].content;

    const model = genAI.getGenerativeModel({ 
      model: 'gemini-2.0-flash',
      systemInstruction: NIKOS_SYSTEM,
    });

    const chat = model.startChat({ history });
    const result = await chat.sendMessageStream(lastMessage);

    const encoder = new TextEncoder();
    const readable = new ReadableStream({
      async start(controller) {
        try {
          for await (const chunk of result.stream) {
            const text = chunk.text();
            if (text) {
              const data = JSON.stringify({ delta: { text } });
              controller.enqueue(encoder.encode(`data: ${data}\n\n`));
            }
          }
          controller.enqueue(encoder.encode('data: [DONE]\n\n'));
          controller.close();
        } catch (streamErr) {
          controller.error(streamErr);
        }
      },
    });

    return new Response(readable, {
      headers: {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache, no-transform',
        'Connection': 'keep-alive',
      },
    });
  } catch (error: any) {
    console.error('[Nikos/Concierge Error]', error?.message || error);
    
    // Check if it's a Gemini Quota Exceeded error
    const isQuotaError = error?.message?.includes('429') || error?.message?.includes('quota');
    const errorMessage = isQuotaError 
      ? 'GEMINI_API_ERROR: Your Gemini API Key has exceeded its free tier quota. Please check your Google AI Studio billing details.'
      : 'Nikos is catching a late ferry — please try again in a moment.';

    return new Response(
      JSON.stringify({ error: errorMessage }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}
