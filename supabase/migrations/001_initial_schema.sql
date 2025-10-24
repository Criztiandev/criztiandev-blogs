-- =====================================================
-- Portfolio Blog Engagement & Rate Limiting Schema
-- =====================================================
-- This migration creates tables for:
-- 1. Blog likes (per blog post)
-- 2. Blog shares (per blog per platform)
-- 3. AI usage rate limiting (per IP per day)
-- =====================================================

-- Table 1: Blog Likes
-- Stores like counts for each blog post
CREATE TABLE IF NOT EXISTS blog_likes (
  blog_slug TEXT PRIMARY KEY,
  count INTEGER DEFAULT 0 NOT NULL CHECK (count >= 0),
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- Table 2: Blog Shares
-- Stores share button click counts per blog per platform
CREATE TABLE IF NOT EXISTS blog_shares (
  id SERIAL PRIMARY KEY,
  blog_slug TEXT NOT NULL,
  platform TEXT NOT NULL CHECK (platform IN ('twitter', 'linkedin', 'facebook', 'medium')),
  count INTEGER DEFAULT 0 NOT NULL CHECK (count >= 0),
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  CONSTRAINT unique_blog_platform UNIQUE(blog_slug, platform)
);

-- Table 3: AI Usage Rate Limiting
-- Tracks AI message usage per IP address per day
CREATE TABLE IF NOT EXISTS ai_usage (
  ip_hash TEXT NOT NULL,
  date DATE NOT NULL DEFAULT CURRENT_DATE,
  count INTEGER DEFAULT 0 NOT NULL CHECK (count >= 0),
  recent_timestamps BIGINT[] DEFAULT '{}' NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  CONSTRAINT pk_ai_usage PRIMARY KEY (ip_hash, date)
);

-- =====================================================
-- Indexes for Performance
-- =====================================================

-- Index for querying shares by blog slug
CREATE INDEX IF NOT EXISTS idx_blog_shares_slug ON blog_shares(blog_slug);

-- Index for querying AI usage by date (for cleanup)
CREATE INDEX IF NOT EXISTS idx_ai_usage_date ON ai_usage(date);

-- =====================================================
-- Row Level Security (RLS)
-- =====================================================

-- Enable RLS on all tables
ALTER TABLE blog_likes ENABLE ROW LEVEL SECURITY;
ALTER TABLE blog_shares ENABLE ROW LEVEL SECURITY;
ALTER TABLE ai_usage ENABLE ROW LEVEL SECURITY;

-- Allow public read access (anyone can view counts)
CREATE POLICY "Allow public read access" ON blog_likes
  FOR SELECT USING (true);

CREATE POLICY "Allow public read access" ON blog_shares
  FOR SELECT USING (true);

-- Allow public write access (anyone can increment counts)
-- Note: We trust server-side validation via tRPC
CREATE POLICY "Allow public insert" ON blog_likes
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Allow public update" ON blog_likes
  FOR UPDATE USING (true);

CREATE POLICY "Allow public insert" ON blog_shares
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Allow public update" ON blog_shares
  FOR UPDATE USING (true);

-- AI usage: Only allow service role to read/write (server-side only)
-- This prevents client-side bypass of rate limits
CREATE POLICY "Service role only" ON ai_usage
  FOR ALL USING (false);

-- =====================================================
-- Functions for Atomic Operations
-- =====================================================

-- Function to increment like count atomically
CREATE OR REPLACE FUNCTION increment_like_count(p_blog_slug TEXT, p_increment INTEGER)
RETURNS INTEGER
LANGUAGE plpgsql
AS $$
DECLARE
  v_new_count INTEGER;
BEGIN
  -- Upsert: insert if not exists, update if exists
  INSERT INTO blog_likes (blog_slug, count, updated_at)
  VALUES (p_blog_slug, GREATEST(0, p_increment), NOW())
  ON CONFLICT (blog_slug)
  DO UPDATE SET
    count = GREATEST(0, blog_likes.count + p_increment),
    updated_at = NOW()
  RETURNING count INTO v_new_count;

  RETURN v_new_count;
END;
$$;

-- Function to increment share count atomically
CREATE OR REPLACE FUNCTION increment_share_count(p_blog_slug TEXT, p_platform TEXT)
RETURNS INTEGER
LANGUAGE plpgsql
AS $$
DECLARE
  v_new_count INTEGER;
BEGIN
  -- Upsert: insert if not exists, update if exists
  INSERT INTO blog_shares (blog_slug, platform, count, updated_at)
  VALUES (p_blog_slug, p_platform, 1, NOW())
  ON CONFLICT (blog_slug, platform)
  DO UPDATE SET
    count = blog_shares.count + 1,
    updated_at = NOW()
  RETURNING count INTO v_new_count;

  RETURN v_new_count;
END;
$$;

-- =====================================================
-- Cleanup Function (Optional - Run Periodically)
-- =====================================================

-- Function to clean up old AI usage records (older than 7 days)
CREATE OR REPLACE FUNCTION cleanup_old_ai_usage()
RETURNS INTEGER
LANGUAGE plpgsql
AS $$
DECLARE
  v_deleted_count INTEGER;
BEGIN
  DELETE FROM ai_usage
  WHERE date < CURRENT_DATE - INTERVAL '7 days';

  GET DIAGNOSTICS v_deleted_count = ROW_COUNT;
  RETURN v_deleted_count;
END;
$$;

-- =====================================================
-- Initial Data (Optional)
-- =====================================================

-- You can add initial blog slugs here if needed
-- INSERT INTO blog_likes (blog_slug, count) VALUES ('example-blog', 0);

-- =====================================================
-- Migration Complete
-- =====================================================
