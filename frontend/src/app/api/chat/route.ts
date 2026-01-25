import { NextRequest, NextResponse } from 'next/server';

// This simulates a Generative AI response streaming back to the client
export async function POST(req: NextRequest) {
    const { prompt, context } = await req.json();

    // In a real app, you would call OpenAI/Anthropic here with the prompt and context
    // const stream = await openai.chat.completions.create({ stream: true, ... });

    const encoder = new TextEncoder();
    const readable = new ReadableStream({
        async start(controller) {
            const mockResponseText = `Based on the analysis of **${context?.role || 'the role'}** in the **${context?.department || 'department'}**:

1. **Skill Gaps identified**:
   - Advanced TypeScript patterns
   - WebGL shader optimization
   - Cloud architecture (AWS/GCP)

2. **Recommended Actions**:
   - *Course*: "Advanced React patterns & Performance"
   - *Mentorship*: Pair with Senior Backend Engineer for Cloud ops.

3. **Synthesis**:
   The current score of ${context?.skillGapScore || 0} indicates a need for immediate upskilling in technical depth.
`;

            const chunks = mockResponseText.split(/(?=[,.\n])/); // Split by punctuation to simulate chunks

            for (const chunk of chunks) {
                // Simulate network delay
                await new Promise(r => setTimeout(r, 50 + Math.random() * 100));
                controller.enqueue(encoder.encode(chunk));
            }
            controller.close();
        },
    });

    return new NextResponse(readable, {
        headers: { 'Content-Type': 'text/plain; charset=utf-8' },
    });
}
