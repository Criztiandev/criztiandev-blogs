import { createClient } from "@supabase/supabase-js";
import { createHash } from "crypto";

// Supabase configuration
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

// Validate environment variables
if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error(
    "Missing Supabase environment variables. Please add NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY to .env.local"
  );
}

/**
 * Client-side Supabase client
 * Uses anon key - subject to Row Level Security (RLS)
 * Safe to use in browser
 */
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: false, // We're not using auth, so disable session persistence
  },
});

/**
 * Server-side Supabase client
 * Uses service role key - bypasses Row Level Security (RLS)
 * NEVER expose this to the client
 * Only use in API routes and server components
 */
export const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    persistSession: false,
    autoRefreshToken: false,
  },
});

/**
 * Hash IP address for privacy
 * Uses SHA-256 to create a one-way hash
 * Cannot be reversed to get original IP
 *
 * @param ip - IP address to hash
 * @returns Hashed IP string
 */
export function hashIP(ip: string): string {
  return createHash("sha256").update(ip).digest("hex");
}

/**
 * Get client IP address from request headers
 * Checks multiple headers in order of preference:
 * 1. x-forwarded-for (proxies, load balancers)
 * 2. x-real-ip (nginx)
 * 3. x-client-ip (alternative)
 * 4. cf-connecting-ip (Cloudflare)
 * 5. fastly-client-ip (Fastly CDN)
 * 6. x-cluster-client-ip (alternative)
 * 7. x-forwarded (alternative)
 * 8. forwarded-for (alternative)
 * 9. forwarded (RFC 7239)
 *
 * @param headers - Request headers (Next.js headers or custom object)
 * @returns IP address string or 'unknown' if not found
 */
export function getClientIP(
  headers: Headers | Record<string, string | string[] | undefined>
): string {
  // Helper to get header value (works with both Headers object and plain object)
  const getHeader = (name: string): string | null => {
    if (headers instanceof Headers) {
      return headers.get(name);
    }
    const value = headers[name];
    if (Array.isArray(value)) return value[0] || null;
    return value || null;
  };

  // Try various headers in order of preference
  const forwardedFor = getHeader("x-forwarded-for");
  if (forwardedFor) {
    // x-forwarded-for can contain multiple IPs (client, proxy1, proxy2)
    // The first one is the original client IP
    return forwardedFor.split(",")[0].trim();
  }

  const realIP = getHeader("x-real-ip");
  if (realIP) return realIP;

  const clientIP = getHeader("x-client-ip");
  if (clientIP) return clientIP;

  const cfConnectingIP = getHeader("cf-connecting-ip");
  if (cfConnectingIP) return cfConnectingIP;

  const fastlyClientIP = getHeader("fastly-client-ip");
  if (fastlyClientIP) return fastlyClientIP;

  const clusterClientIP = getHeader("x-cluster-client-ip");
  if (clusterClientIP) return clusterClientIP;

  const xForwarded = getHeader("x-forwarded");
  if (xForwarded) return xForwarded;

  const forwardedFor2 = getHeader("forwarded-for");
  if (forwardedFor2) return forwardedFor2;

  const forwarded = getHeader("forwarded");
  if (forwarded) {
    // Parse RFC 7239 format: Forwarded: for=192.0.2.60;proto=http;by=203.0.113.43
    const match = forwarded.match(/for=([^;,\s]+)/);
    if (match) return match[1];
  }

  // Fallback: return 'unknown' (should rarely happen in production)
  return "unknown";
}

/**
 * Database table types (for TypeScript)
 */
export interface BlogLike {
  blog_slug: string;
  count: number;
  updated_at: string;
}

export interface BlogShare {
  id: number;
  blog_slug: string;
  platform: "twitter" | "linkedin" | "facebook" | "medium";
  count: number;
  updated_at: string;
}

export interface AIUsage {
  ip_hash: string;
  date: string;
  count: number;
  recent_timestamps: number[];
  updated_at: string;
}
