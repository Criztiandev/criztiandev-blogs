import { NextRequest, NextResponse } from "next/server";
import Groq from "groq-sdk";

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

/**
 * Model fallback configuration
 * Models are tried in order when rate limits are hit
 */
const MODEL_FALLBACK_CHAIN = [
  {
    model: "llama-3.3-70b-versatile",
    description: "Best quality, lower limits",
  },
  {
    model: "llama-3.1-8b-instant",
    description: "High RPD fallback",
  },
] as const;

/**
 * Detects if error is a rate limit error from Groq API
 */
function isRateLimitError(error: unknown): boolean {
  if (error instanceof Error) {
    const message = error.message.toLowerCase();
    return (
      message.includes("rate limit") ||
      message.includes("429") ||
      message.includes("quota") ||
      message.includes("too many requests")
    );
  }
  return false;
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { messages, blogContent, blogTitle } = body;

    if (!messages || !Array.isArray(messages)) {
      return NextResponse.json({ error: "Messages array is required" }, { status: 400 });
    }

    // Create system message with blog context
    const systemMessage = {
      role: "system" as const,
      content: `You are blog writer with 10 years of experience, You are writing style to be semi casual, uses layman term for complex words to make it easy to understand, you provide example that is easy to understand, you provide use cases for the topic and you provide a non bias point of view You're helping the user understand a blog post${
        blogTitle ? ` titled "${blogTitle}"` : ""
      }. Here is the blog content for context:

${blogContent}

Answer questions about this blog post, provide summaries, explain concepts, and help the user understand the content better. Be concise and helpful. do not over extend or go out of scope of the content and the topic`,
    };

    const chatMessages = [systemMessage, ...messages];

    // Create a readable stream
    const encoder = new TextEncoder();
    const stream = new ReadableStream({
      async start(controller) {
        let lastError: Error | null = null;

        // Try each model in the fallback chain
        for (let i = 0; i < MODEL_FALLBACK_CHAIN.length; i++) {
          const modelConfig = MODEL_FALLBACK_CHAIN[i];

          try {
            console.log(
              `[AI Stream] Attempting with model ${i + 1}/${MODEL_FALLBACK_CHAIN.length}: ${modelConfig.model}`
            );

            // Call Groq API with streaming
            const completion = await groq.chat.completions.create({
              model: modelConfig.model,
              messages: chatMessages,
              temperature: 0.6,
              max_completion_tokens: 1024,
              top_p: 0.95,
              stream: true,
            });

            // Stream the response
            for await (const chunk of completion) {
              const content = chunk.choices[0]?.delta?.content;
              if (content) {
                controller.enqueue(encoder.encode(content));
              }
            }

            console.log(`[AI Stream] ✓ Success with model: ${modelConfig.model}`);
            controller.close();
            return; // Success, exit the function
          } catch (error) {
            lastError = error instanceof Error ? error : new Error("Unknown error");

            // Check if it's a rate limit error
            if (isRateLimitError(error)) {
              console.warn(
                `[AI Stream] ✗ Rate limit hit for ${modelConfig.model}, trying next model...`
              );
              continue;
            } else {
              console.error(`[AI Stream] ✗ Error with ${modelConfig.model}:`, lastError.message);
              continue;
            }
          }
        }

        // All models failed
        console.error("[AI Stream] ✗ All models exhausted");
        controller.enqueue(
          encoder.encode(
            `Error: ${lastError?.message || "Failed to get AI response from all available models"}`
          )
        );
        controller.close();
      },
    });

    return new Response(stream, {
      headers: {
        "Content-Type": "text/plain; charset=utf-8",
        "Cache-Control": "no-cache",
        Connection: "keep-alive",
      },
    });
  } catch (error) {
    console.error("[AI Stream] Error:", error);
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : "Failed to process request",
      },
      { status: 500 }
    );
  }
}
