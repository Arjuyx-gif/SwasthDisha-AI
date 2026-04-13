import { NextRequest } from 'next/server';
import Groq from 'groq-sdk';

// Set function timeout for Vercel
export const maxDuration = 60;

export async function POST(req: NextRequest) {
  const apiKey = process.env.GROQ_API_KEY;
  if (!apiKey || apiKey.length < 10) {
    return new Response('Error: GROQ_API_KEY is missing or invalid in .env.local', { status: 500 });
  }

  try {
    const { messages, context } = await req.json();

    // Build patient context string from the report data sent by the frontend
    const reportContext = context
      ? `Patient Summary: ${context.summary || 'None provided'}
Patient Labs: ${context.labValues?.map((v: any) => `${v.name}: ${v.value} ${v.unit} (${v.status})`).join(', ') || 'None'}`
      : '';

    const SYSTEM_PROMPT = `You are Dr. Umeed, a warm and knowledgeable medical AI assistant on SwasthDisha AI — India's AI health copilot.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🌐 CRITICAL LANGUAGE RULE — FOLLOW THIS BEFORE EVERYTHING ELSE:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Look at the user's message language and respond ONLY in that SAME language.
- User writes in ENGLISH → your ENTIRE reply must be in English. No Hindi. No Hinglish.
- User writes in HINGLISH (Roman script, e.g. "mera report kaisa hai") → your ENTIRE reply must be in Hinglish only.
- User writes in HINDI (Devanagari, e.g. "मेरी रिपोर्ट कैसी है") → your ENTIRE reply must be in Hindi only.

DO NOT produce two sections (no "EN: ... HI: ..." format). One language. One reply.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
QUESTION TYPE:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

A) CASUAL / GREETING (e.g. "hello", "how are my reports?", "what can you do"):
   → Reply conversationally in 2–3 sentences, like a friendly doctor.
   → No bullet lists. If a report is loaded, briefly mention the patient's overall status.

B) MEDICAL / LAB-RELATED (e.g. "what does low hemoglobin mean", "my HbA1c is high"):
   → Use this structure:
     **[Topic]**
     • What it means
     • Why it matters
     • What to do (2–3 steps)
     • ⚠️ See a doctor if...
     • _I'm an AI — always consult your doctor._

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
TONE: Warm, simple, encouraging. Never alarmist. Keep it concise.
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
${reportContext ? `\n👤 PATIENT CONTEXT:\n${reportContext}` : ''}`;

    // Get the language of the last user message to reinforce language mirroring
    const lastUserMessage = [...messages].reverse().find((m: any) => m.role === 'user');
    const userText = lastUserMessage?.content || '';

    // Simple heuristic: detect if the user wrote in English, Hinglish, or Hindi
    const hasDevanagari = /[\u0900-\u097F]/.test(userText);
    const hasRomanHindiWords = /\b(mera|meri|aapka|kaise|kya|hai|hain|nahi|bahut|thoda|zyada|kam|batao|bolo|hoga|kaisa|acha|accha|theek)\b/i.test(userText);

    let languageInstruction = '';
    if (hasDevanagari) {
      languageInstruction = '[SYSTEM: User is writing in Hindi/Devanagari. Reply ONLY in Hindi.]';
    } else if (hasRomanHindiWords) {
      languageInstruction = '[SYSTEM: User is writing in Hinglish. Reply ONLY in Hinglish using Roman script.]';
    } else {
      languageInstruction = '[SYSTEM: User is writing in English. Reply ONLY in English.]';
    }

    // Build message list — inject language instruction as a system note before the last user message
    const augmentedMessages = messages.map((m: any, idx: number) => {
      if (idx === messages.length - 1 && m.role === 'user') {
        return { role: 'user', content: `${languageInstruction}\n\n${m.content}` };
      }
      return { role: m.role, content: m.content };
    });

    const groq = new Groq({ apiKey });

    // Single direct streaming call — no redundant pre-call
    const stream = await groq.chat.completions.create({
      model: 'llama-3.1-8b-instant',
      messages: [
        { role: 'system', content: SYSTEM_PROMPT },
        ...augmentedMessages,
      ],
      stream: true,
      temperature: 0.5,
      max_tokens: 700,
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