import { router, publicProcedure } from "../trpc";
import { supabaseAdmin, hashIP, getClientIP } from "@/lib/supabase";
import { headers } from "next/headers";

// Rate limit configuration
const MAX_MESSAGES_PER_DAY = 15;
const MAX_MESSAGES_PER_MINUTE = 3;
const MINUTE_IN_MS = 60 * 1000;

/**
 * Rate Limit Router
 * Handles AI usage rate limiting with server-side enforcement
 */
export const rateLimitRouter = router({
  /**
   * Check if user can send a message
   * Returns allowed status and remaining counts
   */
  check: publicProcedure.query(async () => {
    // Get client IP from request headers
    const headersList = await headers();
    const ip = getClientIP(headersList);
    const ipHash = hashIP(ip);
    const today = new Date().toISOString().split("T")[0];
    const now = Date.now();

    // Get or create usage record for today
    const { data: usage, error: fetchError } = await supabaseAdmin
      .from("ai_usage")
      .select("*")
      .eq("ip_hash", ipHash)
      .eq("date", today)
      .single();

    if (fetchError && fetchError.code !== "PGRST116") {
      // PGRST116 = no rows found, which is fine (first time user)
      throw new Error(`Failed to check rate limit: ${fetchError.message}`);
    }

    // If no record exists, user hasn't sent any messages today
    if (!usage) {
      return {
        allowed: true,
        remainingDaily: MAX_MESSAGES_PER_DAY,
        remainingMinute: MAX_MESSAGES_PER_MINUTE,
        reason: null,
      };
    }

    // Check daily limit
    if (usage.count >= MAX_MESSAGES_PER_DAY) {
      return {
        allowed: false,
        remainingDaily: 0,
        remainingMinute: 0,
        reason: "Limit reached. Try again tomorrow.",
      };
    }

    // Check per-minute limit
    // Filter timestamps to only include those in the last minute
    const recentTimestamps = (usage.recent_timestamps || []).filter(
      (timestamp: number) => now - timestamp < MINUTE_IN_MS
    );

    if (recentTimestamps.length >= MAX_MESSAGES_PER_MINUTE) {
      const oldestTimestamp = Math.min(...recentTimestamps);
      const waitTimeSeconds = Math.ceil((MINUTE_IN_MS - (now - oldestTimestamp)) / 1000);

      return {
        allowed: false,
        remainingDaily: MAX_MESSAGES_PER_DAY - usage.count,
        remainingMinute: 0,
        reason: `Too many messages. Please wait ${waitTimeSeconds} seconds.`,
      };
    }

    return {
      allowed: true,
      remainingDaily: MAX_MESSAGES_PER_DAY - usage.count,
      remainingMinute: MAX_MESSAGES_PER_MINUTE - recentTimestamps.length,
      reason: null,
    };
  }),

  /**
   * Record a message sent
   * Increments daily count and adds timestamp to recent messages
   */
  record: publicProcedure.mutation(async () => {
    // Get client IP from request headers
    const headersList = await headers();
    const ip = getClientIP(headersList);
    const ipHash = hashIP(ip);
    const today = new Date().toISOString().split("T")[0];
    const now = Date.now();

    // Get current usage record
    const { data: usage, error: fetchError } = await supabaseAdmin
      .from("ai_usage")
      .select("*")
      .eq("ip_hash", ipHash)
      .eq("date", today)
      .single();

    if (fetchError && fetchError.code !== "PGRST116") {
      throw new Error(`Failed to record usage: ${fetchError.message}`);
    }

    // Filter recent timestamps (last minute only)
    const existingTimestamps = usage?.recent_timestamps || [];
    const recentTimestamps = existingTimestamps.filter(
      (timestamp: number) => now - timestamp < MINUTE_IN_MS
    );

    // Add current timestamp
    recentTimestamps.push(now);

    // Upsert usage record
    const { error: upsertError } = await supabaseAdmin.from("ai_usage").upsert(
      {
        ip_hash: ipHash,
        date: today,
        count: (usage?.count ?? 0) + 1,
        recent_timestamps: recentTimestamps,
        updated_at: new Date().toISOString(),
      },
      {
        onConflict: "ip_hash,date",
      }
    );

    if (upsertError) {
      throw new Error(`Failed to record usage: ${upsertError.message}`);
    }

    return {
      success: true,
      remainingDaily: MAX_MESSAGES_PER_DAY - ((usage?.count ?? 0) + 1),
      remainingMinute: MAX_MESSAGES_PER_MINUTE - recentTimestamps.length,
    };
  }),

  /**
   * Get remaining message counts
   * Returns daily and per-minute remaining counts
   */
  getRemaining: publicProcedure.query(async () => {
    // Get client IP from request headers
    const headersList = await headers();
    const ip = getClientIP(headersList);
    const ipHash = hashIP(ip);
    const today = new Date().toISOString().split("T")[0];

    // Get usage record
    const { data: usage } = await supabaseAdmin
      .from("ai_usage")
      .select("count")
      .eq("ip_hash", ipHash)
      .eq("date", today)
      .single();

    return {
      daily: MAX_MESSAGES_PER_DAY - (usage?.count ?? 0),
      minute: MAX_MESSAGES_PER_MINUTE,
    };
  }),
});
