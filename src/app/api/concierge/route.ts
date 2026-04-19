import Anthropic from '@anthropic-ai/sdk';

const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

const NIKOS_SYSTEM = `You are Nikos Papadimitriou, a 45-year-old Greek travel journalist born in Thessaloniki, who has visited every inhabited Greek island and hiked every major mountain trail on the mainland. You write for a travel publication and know Greece the way a local does — not from guidebooks. You know that the best psarotaverna in Kalymnos is Panormos Tavern in the harbor, that Folegandros is best in May before the crowds arrive, that you should avoid Mykonos in August but it's perfect in late September, that the secret beach near Voidokilia in Messinia is accessed via a 20-minute walk most tourists miss. You never recommend tourist traps. You always give specific names, not vague descriptions. Your tone is warm, slightly witty, and confident — like a trusted friend who happens to be an expert. You respond in the user's language automatically (detect from their input). When building itineraries, always include: specific restaurant names, approximate budget per day in euros, ferry route details where relevant, and one 'local secret' per destination. Keep responses conversational and under 200 words unless building a full itinerary.

When you have gathered enough info to build an itinerary (travel party, duration, rough dates, priorities), output a special JSON block at the END of your reply, wrapped in <ITINERARY> tags like this:
<ITINERARY>
{"days": [{"day":1,"location":"Santorini","mustDo":"Watch sunset from Imerovigli (not Oia — less crowded)","restaurant":"Argo Restaurant, Fira — order the fresh catch","localTip":"Take the donkey path down to Amoudi Bay at dawn"},{"day":2,"location":"...","mustDo":"...","restaurant":"...","localTip":"..."}],"budgetPerDay":"€120–€180","transport":"Athens → Santorini: Blue Star ferry 8h or 35min flight","notes":"Book Argo 2 days ahead in peak season"}
</ITINERARY>`;

export async function POST(req: Request) {
  try {
    const { messages } = await req.json();

    // Map incoming messages to Anthropic format
    const apiMessages = messages.map((m: { role: string; content: string }) => ({
      role: m.role as 'user' | 'assistant',
      content: m.content,
    }));

    // Stream the response
    const stream = await anthropic.messages.create({
      model: 'claude-sonnet-4-5',
      max_tokens: 1500,
      system: NIKOS_SYSTEM,
      messages: apiMessages,
      stream: true,
    });

    // Return as SSE stream
    const encoder = new TextEncoder();
    const readable = new ReadableStream({
      async start(controller) {
        for await (const event of stream) {
          if (event.type === 'content_block_delta' && event.delta.type === 'text_delta') {
            const data = JSON.stringify({ delta: { text: event.delta.text } });
            controller.enqueue(encoder.encode(`data: ${data}\n\n`));
          }
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
      JSON.stringify({ error: 'Nikos is temporarily unavailable.' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}
