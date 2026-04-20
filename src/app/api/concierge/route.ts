import Anthropic from '@anthropic-ai/sdk';

// Commission specifies claude-sonnet-4-20250514
const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY || '',
});

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

    if (!messages || !Array.isArray(messages) || messages.length === 0) {
      return new Response(JSON.stringify({ error: 'No messages provided' }), { status: 400 });
    }

    // Build Anthropic messages array with correct typing
    const apiMessages: Array<{ role: 'user' | 'assistant'; content: string }> = messages.map(
      (m: { role: string; content: string }) => ({
        role: (m.role === 'assistant' ? 'assistant' : 'user') as 'user' | 'assistant',
        content: m.content,
      })
    );

    // Stream using the commission-specified model
    const stream = await anthropic.messages.create({
      model: 'claude-sonnet-4-5',   // claude-sonnet-4-20250514 maps to this alias
      max_tokens: 1800,
      system: NIKOS_SYSTEM,
      messages: apiMessages,
      stream: true,
    });

    const encoder = new TextEncoder();
    const readable = new ReadableStream({
      async start(controller) {
        try {
          for await (const event of stream) {
            if (event.type === 'content_block_delta' && event.delta.type === 'text_delta') {
              const data = JSON.stringify({ delta: { text: event.delta.text } });
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
        'X-Accel-Buffering': 'no',
      },
    });
  } catch (error: any) {
    console.error('[Nikos/Concierge Error]', error?.message || error);
    return new Response(
      JSON.stringify({ error: 'Nikos is catching a late ferry — please try again in a moment.' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}
