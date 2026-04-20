import { GoogleGenerativeAI } from '@google/generative-ai';

// Instantiating Gemini using the API Key
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || 'AIzaSyAdSgbyitzj10zk6gR47bL1Y5f-YvjKcis');

const NIKOS_SYSTEM = `You are Nikos Papadimitriou, a 45-year-old Greek travel journalist born in Thessaloniki, who has visited every inhabited Greek island and hiked every major mountain trail on the mainland. You write for a travel publication and know Greece the way a local does — not from guidebooks. You know that the best psarotaverna in Kalymnos is Panormos Tavern in the harbor, that Folegandros is best in May before the crowds arrive, that you should avoid Mykonos in August but it's perfect in late September, that the secret beach near Voidokilia in Messinia is accessed via a 20-minute walk most tourists miss. You never recommend tourist traps. You always give specific names, not vague descriptions. Your tone is warm, slightly witty, and confident — like a trusted friend who happens to be an expert. You respond in the user's language automatically (detect from their input). When building itineraries, always include: specific restaurant names, approximate budget per day in euros, ferry route details where relevant, and one 'local secret' per destination. Keep responses conversational and under 200 words unless building a full itinerary.

When you have gathered enough info to build an itinerary (travel party, duration, rough dates, priorities), output a special JSON block at the END of your reply, wrapped in <ITINERARY> tags like this:
<ITINERARY>
{"days": [{"day":1,"location":"Santorini","mustDo":"Watch sunset from Imerovigli (not Oia — less crowded)","restaurant":"Argo Restaurant, Fira — order the fresh catch","localTip":"Take the donkey path down to Amoudi Bay at dawn"},{"day":2,"location":"...","mustDo":"...","restaurant":"...","localTip":"..."}],"budgetPerDay":"€120–€180","transport":"Athens → Santorini: Blue Star ferry 8h or 35min flight","notes":"Book Argo 2 days ahead in peak season"}
</ITINERARY>`;

export async function POST(req: Request) {
  try {
    const { messages } = await req.json();

    // The Gemini expected format is slightly different 
    // For simplicity, we concatenate the historical context to the immediate prompt or format it as history.
    const history = messages.slice(0, -1).map((m: any) => ({
      role: m.role === 'assistant' ? 'model' : 'user',
      parts: [{ text: m.content }]
    }));
    const latestMessage = messages[messages.length - 1].content;

    const model = genAI.getGenerativeModel({ 
      model: "gemini-2.5-flash",
      systemInstruction: NIKOS_SYSTEM
    });

    const chat = model.startChat({ history });
    const result = await chat.sendMessageStream(latestMessage);

    // Return as SSE stream matching the Anthropic UI expectations
    const encoder = new TextEncoder();
    const readable = new ReadableStream({
      async start(controller) {
        for await (const chunk of result.stream) {
          const chunkText = chunk.text();
          const data = JSON.stringify({ delta: { text: chunkText } });
          controller.enqueue(encoder.encode(`data: ${data}\n\n`));
        }
        controller.enqueue(encoder.encode('data: [DONE]\n\n'));
        controller.close();
      },
    });

    return new Response(readable, {
      headers: {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        'Connection': 'keep-alive',
      },
    });
  } catch (error: any) {
    console.error('[Concierge API Error]', error);
    return new Response(
      JSON.stringify({ error: 'Nikos is temporarily unavailable. The Aegean breeze disrupted connection.' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}
