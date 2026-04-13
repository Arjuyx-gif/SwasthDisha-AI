import { NextRequest } from 'next/server';
import Groq from 'groq-sdk';
import { executeFullPipeline } from '@/lib/ragEngine';

// Set function timeout for Vercel
export const maxDuration = 60;

export async function POST(req: NextRequest) {
  const apiKey = process.env.GROQ_API_KEY;
  if (!apiKey || apiKey.length < 10) {
    return new Response('Error: GROQ_API_KEY is missing or invalid in .env.local', { status: 500 });
  }

  try {
    const { messages, context } = await req.json();

    // Map the context object sent from the frontend to a readable text format for the LLM
    const reportContext = context ? `
Patient Summary: ${context.summary || 'None provided'}
Patient Labs: ${context.labValues?.map((v: any) => `${v.name}: ${v.value} ${v.unit} (${v.status})`).join(', ') || 'None'}
` : '';

    const SYSTEM_PROMPT = `
You are Dr. Umeed, a warm and knowledgeable medical AI assistant on SwasthDisha AI — India's AI health copilot.
Your primary role is helping patients understand their lab reports, but you are also a supportive companion who can hold a normal friendly conversation.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🌐 LANGUAGE RULE — THIS IS THE MOST IMPORTANT RULE:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Detect the language the user is writing in and respond ONLY in that same language. Do NOT mix languages in a single reply.

• If the user writes in ENGLISH → respond fully in English only.
• If the user writes in HINGLISH (Roman script Hindi, e.g. "mera hemoglobin kam hai") → respond fully in Hinglish only.
• If the user writes in HINDI (Devanagari script) → respond fully in Hindi only.

NEVER produce dual sections like "EN: ... HI: ..." or "English: ... Hindi: ..." — give one single unified response in the user's language only.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
STEP 1 — DETECT THE TYPE OF QUESTION:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

A) GENERAL / GREETINGS / CASUAL questions (e.g. "hello", "how are you", "what can you do", "who are you", "how are my reports?"):
   → Reply naturally, warmly, and conversationally in 2-4 sentences.
   → DO NOT use a structured bullet format. Just talk like a friendly doctor would.
   → If a report is available, give a brief friendly summary of their overall health status.
   → Use the user's language as per the language rule above.

B) MEDICAL / HEALTH / LAB-RELATED questions (e.g. "what does high creatinine mean", "my HbA1c is 7.2", "my hemoglobin is low"):
   → Use a clear structured format with bullets.
   → Use the user's language as per the language rule above.
   → Structure your answer as:
      **[Topic Header]**
      • What it means — 1-2 clear sentences
      • Why it matters — impact on health
      • What to do — 2-4 numbered actionable steps
      • ⚠️ See a doctor if — red flag symptoms
      • _Disclaimer: I'm an AI. Always consult your doctor for personal medical advice._

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
TONE & STYLE RULES:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
✓ Warm, empathetic, never clinical or cold
✓ Like a caring family doctor — not a textbook
✓ Use simple words, avoid heavy jargon (explain it if you must use it)
✓ Acknowledge emotions first when someone sounds worried or stressed
✓ Be encouraging and hopeful — never alarmist
✓ Keep responses concise but complete — use bullets, not long paragraphs
✓ End with a human touch — a small note of encouragement

${reportContext ? `\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n👤 THIS PATIENT'S CONTEXT (use to personalise answers):\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n${reportContext}` : ''}
`;


    // Get the last user message for query
    const lastUserMessage = [...messages]
      .reverse()
      .find((m: any) => m.role === 'user');
    const query = lastUserMessage?.content || '';

    // Execute three-stage pipeline for chat context
    const pipelineResult = await executeFullPipeline(query, SYSTEM_PROMPT, 'chat');

    const groq = new Groq({ apiKey });
    const augmentedMessages = [
      ...messages.map((m: any) => ({ role: m.role, content: m.content })),
    ];

    // Insert pipeline context into user query if available
    if (pipelineResult.ragContext) {
      const lastIdx = augmentedMessages.length - 1;
      if (augmentedMessages[lastIdx]?.role === 'user') {
        augmentedMessages[lastIdx].content += `\n\n[MEDICAL KNOWLEDGE CONTEXT]\n${pipelineResult.ragContext}`;
      }
    }

    const stream = await groq.chat.completions.create({
      model: 'llama-3.1-8b-instant',
      messages: [
        { role: 'system', content: SYSTEM_PROMPT },
        ...augmentedMessages,
      ],
      stream: true,
      temperature: 0.65,
      max_tokens: 2048,
    });

    const encoder = new TextEncoder();
    const readableStream = new ReadableStream({
      async start(controller) {
        for await (const chunk of stream) {
          const content = chunk.choices[0]?.delta?.content || '';
          controller.enqueue(encoder.encode(content));
        }
        controller.close();
      },
    });

    return new Response(readableStream, {
      headers: {
        'Content-Type': 'text/plain; charset=utf-8',
        'Transfer-Encoding': 'chunked',
      },
    });
  } catch (error) {
    console.error('Chat API Error:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return new Response(`Error connecting to Dr. Umeed: ${errorMessage}`, { status: 500 });
  }
}