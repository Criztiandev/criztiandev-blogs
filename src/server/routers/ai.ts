import { z } from "zod";
import { router, publicProcedure } from "../trpc";
import Groq from "groq-sdk";
import { getPortfolioContext } from "@/lib/get-portfolio-context";

// Initialize Groq client
const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

/**
 * Model fallback configuration
 * Models are tried in order when rate limits are hit
 * Optimized for chat use case with balanced performance/limits
 */
const MODEL_FALLBACK_CHAIN = [
  {
    model: "llama-3.3-70b-versatile",
    rpm: 30,
    rpd: 1000,
    tpm: 12000,
    tpd: 100000,
    description: "Best quality, lower limits",
  },
  {
    model: "meta-llama/llama-4-scout-17b-16e-instruct",
    rpm: 30,
    rpd: 1000,
    tpm: 30000,
    tpd: 500000,
    description: "High TPM fallback",
  },
  {
    model: "llama-3.1-8b-instant",
    rpm: 30,
    rpd: 14400,
    tpm: 6000,
    tpd: 500000,
    description: "High RPD fallback",
  },
  {
    model: "qwen/qwen3-32b",
    rpm: 60,
    rpd: 1000,
    tpm: 6000,
    tpd: 500000,
    description: "High RPM fallback",
  },
  {
    model: "moonshotai/kimi-k2-instruct",
    rpm: 60,
    rpd: 1000,
    tpm: 10000,
    tpd: 300000,
    description: "Final fallback",
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

export const aiRouter = router({
  chat: publicProcedure
    .input(
      z.object({
        messages: z.array(
          z.object({
            role: z.enum(["user", "assistant"]),
            content: z.string(),
          })
        ),
        blogContent: z.string(),
        blogTitle: z.string().optional(),
      })
    )
    .mutation(async ({ input }) => {
      const { messages, blogContent, blogTitle } = input;

      // Create system message with blog context
      const systemMessage = {
        role: "system" as const,
        content: `You are blog writer with 10 years of experience, You are writing style to be simi casual, uses layman term for complex words to make it easy to understand, you provide example that is easy to understand, you provide use cases for the topic and you provide a non bias point of view You're helping the user understand a blog post${
          blogTitle ? ` titled "${blogTitle}"` : ""
        }. Here is the blog content for context:

    ${blogContent}

    Answer questions about this blog post, provide summaries, explain concepts, and help the user understand the content better. Be concise and helpful. do not over extend or go out of scope of the content and the topic`,
      };

      const chatMessages = [systemMessage, ...messages];
      let lastError: Error | null = null;

      // Try each model in the fallback chain
      for (let i = 0; i < MODEL_FALLBACK_CHAIN.length; i++) {
        const modelConfig = MODEL_FALLBACK_CHAIN[i];

        try {
          console.log(
            `[AI] Attempting with model ${i + 1}/${MODEL_FALLBACK_CHAIN.length}: ${modelConfig.model} (${modelConfig.description})`
          );

          // Call Groq API with current model
          const completion = await groq.chat.completions.create({
            model: modelConfig.model,
            messages: chatMessages,
            temperature: 0.6,
            max_completion_tokens: 1024,
            top_p: 0.95,
          });

          const responseContent = completion.choices[0]?.message?.content;

          if (!responseContent) {
            throw new Error("No response from AI");
          }

          // Success! Log which model was used
          console.log(
            `[AI] ✓ Success with model: ${modelConfig.model}${i > 0 ? ` (fallback #${i})` : ""}`
          );

          return {
            content: responseContent,
            modelUsed: modelConfig.model,
            fallbackLevel: i,
          };
        } catch (error) {
          lastError = error instanceof Error ? error : new Error("Unknown error");

          // Check if it's a rate limit error
          if (isRateLimitError(error)) {
            console.warn(`[AI] ✗ Rate limit hit for ${modelConfig.model}, trying next model...`);
            // Continue to next model in chain
            continue;
          } else {
            // Non-rate-limit error, log and try next model anyway
            console.error(`[AI] ✗ Error with ${modelConfig.model}:`, lastError.message);
            // Still try next model as a fallback
            continue;
          }
        }
      }

      // All models failed
      console.error("[AI] ✗ All models exhausted, request failed");
      throw new Error(lastError?.message || "Failed to get AI response from all available models");
    }),

  /**
   * Portfolio Chat - AI assistant for the entire portfolio
   * Following The Algorithm: Simplified context (~8K tokens), no full blog content
   */
  portfolioChat: publicProcedure
    .input(
      z.object({
        messages: z.array(
          z.object({
            role: z.enum(["user", "assistant"]),
            content: z.string(),
          })
        ),
      })
    )
    .mutation(async ({ input }) => {
      const { messages } = input;

      // Build portfolio context (Following Idiot Index: ~8K tokens, not 50K)
      const portfolioContext = await getPortfolioContext();

      // Create system message with portfolio context
      const systemMessage = {
        role: "system" as const,
        content: portfolioContext,
      };

      const chatMessages = [systemMessage, ...messages];
      let lastError: Error | null = null;

      // Try each model in the fallback chain (reuse existing logic)
      for (let i = 0; i < MODEL_FALLBACK_CHAIN.length; i++) {
        const modelConfig = MODEL_FALLBACK_CHAIN[i];

        try {
          console.log(
            `[Portfolio AI] Attempting with model ${i + 1}/${MODEL_FALLBACK_CHAIN.length}: ${modelConfig.model}`
          );

          // Call Groq API with current model
          const completion = await groq.chat.completions.create({
            model: modelConfig.model,
            messages: chatMessages,
            temperature: 0.7,
            max_completion_tokens: 1024,
            top_p: 0.95,
          });

          const responseContent = completion.choices[0]?.message?.content;

          if (!responseContent) {
            throw new Error("No response from AI");
          }

          // Log token usage for Idiot Index tracking
          console.log(
            `[Portfolio AI] ✓ Success with ${modelConfig.model}. Usage: ${completion.usage?.total_tokens || "unknown"} tokens`
          );

          return {
            content: responseContent,
            modelUsed: modelConfig.model,
            fallbackLevel: i,
          };
        } catch (error) {
          lastError = error instanceof Error ? error : new Error("Unknown error");

          // Check if it's a rate limit error
          if (isRateLimitError(error)) {
            console.warn(
              `[Portfolio AI] ✗ Rate limit hit for ${modelConfig.model}, trying next model...`
            );
            continue;
          } else {
            console.error(`[Portfolio AI] ✗ Error with ${modelConfig.model}:`, lastError.message);
            continue;
          }
        }
      }

      // All models failed
      console.error("[Portfolio AI] ✗ All models exhausted, request failed");
      throw new Error(lastError?.message || "Failed to get AI response from all available models");
    }),
});
