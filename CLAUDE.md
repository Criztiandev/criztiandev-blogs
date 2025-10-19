# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

A Next.js 15 portfolio site with a markdown-based blog system featuring tRPC, infinite scroll, AI chat integration, and beautiful Anthropic-inspired design with smooth animations.

## Development Commands

```bash
# Development
npm run dev              # Start dev server with Turbopack
npm run build            # Build for production with Turbopack
npm run start            # Start production server
npm run lint             # Run ESLint

# Blog Management
npm run new-blog "Title" # Create new blog post in content/blogs/
```

## Architecture Overview

### tRPC API Architecture

This project uses tRPC for end-to-end type-safe APIs between client and server.

**Server Setup:**
- [src/server/trpc.ts](src/server/trpc.ts): tRPC initialization with Zod error formatting
- [src/server/root.ts](src/server/root.ts): Main router combining all sub-routers
- [src/server/routers/](src/server/routers/): Individual routers (blog, ai)
- [src/app/api/trpc/[trpc]/route.ts](src/app/api/trpc/[trpc]/route.ts): Next.js API route handler

**Client Setup:**
- [src/lib/trpc.ts](src/lib/trpc.ts): tRPC client with typed hooks
- [src/lib/trpc-provider.tsx](src/lib/trpc-provider.tsx): React provider wrapping TanStack Query
- Root layout wraps app in `<TRPCProvider>`

**Adding New Procedures:**
1. Create router in `src/server/routers/` using `publicProcedure`
2. Add router to `appRouter` in [src/server/root.ts](src/server/root.ts)
3. Use `trpc.[router].[procedure].useQuery()` or `useMutation()` in components

### Blog System Architecture

**Content Storage:**
- Blog posts are markdown files in [content/blogs/](content/blogs/)
- Each has frontmatter (title, date, author, image, tags, description)
- Generated via `npm run new-blog "Title"` script

**Data Flow:**
1. [src/lib/get-blog-posts.ts](src/lib/get-blog-posts.ts): Server-side function reads markdown files with `gray-matter`
2. [src/lib/markdown.ts](src/lib/markdown.ts): Parses markdown to HTML with `remark`, extracts headings for TOC
3. [src/server/routers/blog.ts](src/server/routers/blog.ts): tRPC procedures expose:
   - `blog.list`: Paginated posts for infinite scroll (9 per page)
   - `blog.getBySlug`: Single post with parsed HTML content

**Infinite Scroll Implementation:**
- Uses TanStack Query's `useInfiniteQuery` with cursor-based pagination
- Cursor = index of last loaded item
- Grid layout shows 9 posts per page, loads more on scroll

### Feature-Based Organization

Components are organized by feature in [src/features/](src/features/):
- `features/blog/`: Blog-specific components and data
- `features/landing/`: Landing page components

Shared components in [src/components/](src/components/):
- `components/ui/`: shadcn/ui components (40+ pre-built)
- `components/blog/`: Blog-specific UI (animated cards, AI chat)
- `components/modules/`: Feature modules (right panel with draggable cards)
- `components/providers/`: React context providers

### Animation System

Uses `motion` (Framer Motion) for animations:
- Staggered fade-in animations (100ms delay per item)
- Hover effects: scale (1.05), lift (y: -4px), shadow increases
- Spring physics for natural motion
- GPU-accelerated transforms (scale, translate)

**Key patterns:**
```tsx
<motion.div
  initial={{ opacity: 0, y: 20 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{ delay: index * 0.1 }}
  whileHover={{ y: -4, scale: 1.05 }}
/>
```

### Styling Architecture

- Tailwind CSS 4 with `@tailwindcss/typography` for prose styling
- CSS in [src/app/globals.css](src/app/globals.css)
- shadcn/ui theme configured in [components.json](components.json)
- Path alias `@/*` maps to `src/*`
- Additional registries: Aceternity UI, Magic UI

## Important Patterns

### Blog Post Frontmatter Structure

```yaml
---
title: "Post Title"
slug: "post-slug"
date: "2025-10-18"          # YYYY-MM-DD format
description: "SEO description"
image: "https://..."
tags: ["react", "nextjs"]
author: "Criztiandev"
---
```

### Creating New tRPC Procedures

```typescript
// src/server/routers/example.ts
import { router, publicProcedure } from '../trpc';
import { z } from 'zod';

export const exampleRouter = router({
  getData: publicProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ input }) => {
      // Server-side logic
      return { data: "..." };
    }),
});
```

### Using tRPC in Components

```tsx
'use client';
import { trpc } from '@/lib/trpc';

export function MyComponent() {
  const { data, isLoading } = trpc.blog.list.useQuery({ limit: 9 });
  // or for mutations:
  const mutation = trpc.ai.chat.useMutation();
}
```

## Environment Variables

Required in `.env.local`:
```env
GROQ_API_KEY=your_groq_api_key_here  # For AI chat feature
```

## Key Technologies

- **Next.js 15** with App Router and Turbopack
- **tRPC 11** for type-safe APIs
- **TanStack Query v5** for data fetching/caching
- **Groq SDK** for AI chat (llama-3.3-70b model)
- **Radix UI** for accessible primitives
- **Motion** (Framer Motion) for animations
- **Tailwind CSS 4** for styling
- **gray-matter** for frontmatter parsing
- **remark/remark-html** for markdown processing

## Design Philosophy

This project follows an **Anthropic-inspired minimalistic aesthetic**:

- Ample white space and clean typography
- Subtle, purposeful animations (no distractions)
- 21:9 hero images wider than content (max-w-7xl vs max-w-3xl)
- Fixed blur headers with smooth transitions
- Responsive grid (1/2/3 columns)
- Reading time calculation (200 words/min)
- Staggered animation delays for visual hierarchy

See [DESIGN_IMPROVEMENTS.md](DESIGN_IMPROVEMENTS.md) for detailed design documentation.

## File Naming Conventions

- Components: `kebab-case.tsx` (e.g., `animated-blog-card.tsx`)
- Server files: `kebab-case.ts` (e.g., `get-blog-posts.ts`)
- Blog posts: `kebab-case.md` matching slug
- Folders: `kebab-case`

## Common Tasks

**Adding a new blog post:**
```bash
npm run new-blog "Your Post Title"
# Edit content/blogs/your-post-title.md
```

**Adding a new UI component:**
- Use shadcn/ui CLI or manually add to `src/components/ui/`
- Import and use with `@/components/ui/component-name`

**Adding a new tRPC router:**
1. Create `src/server/routers/my-router.ts`
2. Export router with procedures
3. Add to `appRouter` in `src/server/root.ts`
4. Use in components via `trpc.myRouter.myProcedure`

**Modifying animations:**
- Edit motion props in component files
- Follow existing patterns (initial, animate, whileHover)
- Keep duration between 300-1000ms for consistency

## Context for AI Assistance

**AI Chat Integration:**
- [src/server/routers/ai.ts](src/server/routers/ai.ts): Groq API integration
- System prompt instructs AI to be a helpful blog assistant
- Receives blog title and content as context
- Streams responses for better UX

**Search & Filtering:**
- Search modal with Cmd+K shortcut
- Filters by title and tags in real-time
- Tag click adds to search query
