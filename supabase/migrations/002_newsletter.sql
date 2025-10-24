-- =====================================================
-- Newsletter Subscriptions Migration
-- =====================================================
-- This migration creates table for newsletter email collection
-- =====================================================

-- Table: Newsletter Subscribers
-- Stores email addresses for newsletter subscriptions
CREATE TABLE IF NOT EXISTS newsletter_subscribers (
  id SERIAL PRIMARY KEY,
  email TEXT NOT NULL UNIQUE,
  subscribed_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'unsubscribed')) NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- =====================================================
-- Indexes for Performance
-- =====================================================

-- Index for querying by email
CREATE INDEX IF NOT EXISTS idx_newsletter_email ON newsletter_subscribers(email);

-- Index for querying active subscribers
CREATE INDEX IF NOT EXISTS idx_newsletter_status ON newsletter_subscribers(status);

-- =====================================================
-- Row Level Security (RLS)
-- =====================================================

-- Enable RLS on newsletter table
ALTER TABLE newsletter_subscribers ENABLE ROW LEVEL SECURITY;

-- Allow public insert (anyone can subscribe)
CREATE POLICY "Allow public insert" ON newsletter_subscribers
  FOR INSERT WITH CHECK (true);

-- Only service role can read (privacy protection)
CREATE POLICY "Service role only read" ON newsletter_subscribers
  FOR SELECT USING (false);

-- =====================================================
-- Function to Update Timestamp
-- =====================================================

CREATE OR REPLACE FUNCTION update_newsletter_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to auto-update updated_at
CREATE TRIGGER trigger_update_newsletter_timestamp
  BEFORE UPDATE ON newsletter_subscribers
  FOR EACH ROW
  EXECUTE FUNCTION update_newsletter_updated_at();

-- =====================================================
-- Migration Complete
-- =====================================================
