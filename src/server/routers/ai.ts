import { z } from "zod";
import { router, publicProcedure } from "../trpc";
import Groq from "groq-sdk";

// Initialize Groq client
const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

export const aiRouter = router({
  /**
   * Chat with AI about blog content
   * Takes conversation history and blog content as context
   */
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

      try {
        // Create system message with blog context
        const systemMessage = {
          role: "system" as const,
          content: `You are blog writer with 10 years of experience, You are writing style to be simi casual, uses layman term for complex words to make it easy to understand, you provide example that is easy to understand, you provide use cases for the topic and you provide a non bias point of view You're helping the user understand a blog post${
            blogTitle ? ` titled "${blogTitle}"` : ""
          }. Here is the blog content for context:

      ${blogContent}

      Answer questions about this blog post, provide summaries, explain concepts, and help the user understand the content better. Be concise and helpful. do not over extend or go out of scope of the content and the topic`,
        };

        // Call Groq API
        const completion = await groq.chat.completions.create({
          model: "llama-3.3-70b-versatile",
          messages: [systemMessage, ...messages],
          temperature: 0.6,
          max_completion_tokens: 1024,
          top_p: 0.95,
        });

        const responseContent = completion.choices[0]?.message?.content;

        if (!responseContent) {
          throw new Error("No response from AI");
        }

        console.log(responseContent);

        return {
          content: responseContent,
        };
      } catch (error) {
        console.error("Groq API Error:", error);
        throw new Error(
          error instanceof Error ? error.message : "Failed to get AI response"
        );
      }
    }),
});
