/**
 * Client-side rate limiting utility
 * Prevents spam and abuse without backend complexity
 */

const STORAGE_KEY = "polar_ai_rate_limit";
const MAX_MESSAGES_PER_DAY = 15;
const MAX_MESSAGES_PER_MINUTE = 3;
const COOLDOWN_MS = 60000; // 1 minute

interface RateLimitData {
  dailyCount: number;
  dailyResetDate: string; // ISO date string (YYYY-MM-DD)
  recentMessages: number[]; // Timestamps of recent messages
}

/**
 * Get current rate limit data from localStorage
 */
function getRateLimitData(): RateLimitData {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) {
      return initializeRateLimitData();
    }

    const data: RateLimitData = JSON.parse(stored);

    // Check if we need to reset daily count (new day)
    const today = new Date().toISOString().split("T")[0];
    if (data.dailyResetDate !== today) {
      return initializeRateLimitData();
    }

    // Clean up old timestamps (older than 1 minute)
    const now = Date.now();
    data.recentMessages = data.recentMessages.filter((timestamp) => now - timestamp < COOLDOWN_MS);

    return data;
  } catch (error) {
    console.error("Error reading rate limit data:", error);
    return initializeRateLimitData();
  }
}

/**
 * Initialize fresh rate limit data
 */
function initializeRateLimitData(): RateLimitData {
  const today = new Date().toISOString().split("T")[0];
  return {
    dailyCount: 0,
    dailyResetDate: today,
    recentMessages: [],
  };
}

/**
 * Save rate limit data to localStorage
 */
function saveRateLimitData(data: RateLimitData): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch (error) {
    console.error("Error saving rate limit data:", error);
  }
}

/**
 * Check if user can send a message
 * Returns { allowed: boolean, reason?: string, remainingDaily?: number, remainingMinute?: number }
 */
export function canSendMessage(): {
  allowed: boolean;
  reason?: string;
  remainingDaily: number;
  remainingMinute: number;
  waitTimeMs?: number;
} {
  const data = getRateLimitData();
  const now = Date.now();

  // Check daily limit
  if (data.dailyCount >= MAX_MESSAGES_PER_DAY) {
    return {
      allowed: false,
      reason: `Daily limit reached (${MAX_MESSAGES_PER_DAY} messages per day). Try again tomorrow.`,
      remainingDaily: 0,
      remainingMinute: 0,
    };
  }

  // Check per-minute limit
  const recentCount = data.recentMessages.length;
  if (recentCount >= MAX_MESSAGES_PER_MINUTE) {
    const oldestTimestamp = Math.min(...data.recentMessages);
    const waitTimeMs = COOLDOWN_MS - (now - oldestTimestamp);

    return {
      allowed: false,
      reason: `Too many messages. Please wait ${Math.ceil(waitTimeMs / 1000)} seconds.`,
      remainingDaily: MAX_MESSAGES_PER_DAY - data.dailyCount,
      remainingMinute: 0,
      waitTimeMs,
    };
  }

  return {
    allowed: true,
    remainingDaily: MAX_MESSAGES_PER_DAY - data.dailyCount,
    remainingMinute: MAX_MESSAGES_PER_MINUTE - recentCount,
  };
}

/**
 * Record a sent message (call after successfully sending)
 */
export function recordMessage(): void {
  const data = getRateLimitData();
  const now = Date.now();

  // Increment daily count
  data.dailyCount += 1;

  // Add timestamp to recent messages
  data.recentMessages.push(now);

  // Clean up old timestamps
  data.recentMessages = data.recentMessages.filter((timestamp) => now - timestamp < COOLDOWN_MS);

  saveRateLimitData(data);
}

/**
 * Get remaining message counts
 */
export function getRemainingMessages(): {
  daily: number;
  minute: number;
} {
  const result = canSendMessage();
  return {
    daily: result.remainingDaily,
    minute: result.remainingMinute,
  };
}

/**
 * Reset rate limit data (for testing purposes)
 */
export function resetRateLimit(): void {
  localStorage.removeItem(STORAGE_KEY);
}
