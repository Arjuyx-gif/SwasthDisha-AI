import { NextRequest } from 'next/server';
import Groq from 'groq-sdk';
import { executeFullPipeline } from '@/lib/ragEngine';

// Set function timeout for Vercel
export const maxDuration = 60;

export async function POST(req: NextRequest) {
  try {
    const key = process.env.GROQ_API_KEY;
    if (!key) {
      return new Response('Note: To enable personalized AI coaching insights, please configure your GROQ_API_KEY in the environment settings.', { status: 200 });
    }
    const { labValues, dietaryFlags, dietPlan, language } = await req.json();

    // Build narrative context instead of raw JSON
    const abnormalTests = labValues
      .filter((v: { status: string }) => v.status !== 'NORMAL')
      .map((v: { name: string; value: number; unit: string; status: string }) => `${v.name} (${v.value} ${v.unit} - ${v.status})`)
      .join(', ');
    const flagsSummary = dietaryFlags.join(', ');

    const SYSTEM_PROMPT = `
    You are Dr. Umeed, a clinical nutrition specialist with 20+ years of experience. 
    Provide personalized, evidence-based dietary advice for THIS patient based on their actual lab results.

    PATIENT LAB FINDINGS:
    - Abnormal Results: ${abnormalTests || 'All within normal limits'}
    - Dietary Flags: ${flagsSummary}
    - Recommended Diet: ${dietPlan.name}

    OUTPUT FORMAT — follow this EXACTLY, no deviations:

    EN:
    **[Condition insight]:** [1-2 sentence explanation referencing the patient's specific lab value]
    **[This week's action]:** [One concrete food change they can start today, with an Indian food example]
    **[Why it works]:** [Brief science in plain language]
    **[Encouragement]:** [One warm, hopeful closing sentence]

    HI:
    **[स्थिति की जानकारी]:** [Same as above in Hindi/Hinglish]
    **[इस हफ्ते करें]:** [Same food action in Hindi]
    **[क्यों काम करता है]:** [Same science in Hindi]
    **[हौसला]:** [Same encouragement in Hindi]

    RULES:
    - Reference the ACTUAL lab value (e.g. "Your hemoglobin is 9.5 g/dL")
    - Use Indian foods (palak, rajma, poha, amla, til)
    - Be warm and personal, not clinical
    - Do NOT use bullet points (- ), numbered lists, or ### headers
    - Use ONLY the **bold:** format shown above
    `;


    // Execute three-stage pipeline with 'diet' context
    const queryText = `Dietary recommendations for conditions: ${flagsSummary}. Patient lab findings: ${abnormalTests}`;
    const pipelineResult = await executeFullPipeline(queryText, SYSTEM_PROMPT, 'diet');

    // Stream the generated response
    const groq = new Groq({ apiKey: key });
    const stream = await groq.chat.completions.create({
      model: 'llama-3.1-8b-instant',
      messages: [
        { role: 'system', content: SYSTEM_PROMPT },
        {
          role: 'user',
          content: `Using this context, provide personalized dietary guidance:\n${pipelineResult.ragContext}\n\nQuery: ${pipelineResult.processed}`,
        },
      ],
      stream: true,
      temperature: 0.5,
      max_tokens: 1500,
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
    console.error('Diet Insight API Error:', error);
    return new Response('Unable to generate personalized insight at this moment.', { status: 500 });
  }
}
