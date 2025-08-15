# Migrate Mate - Subscription Cancellation Flow Challenge

## Overview

Convert an existing Figma design into a fully-functional subscription-cancellation flow for Migrate Mate. This challenge tests your ability to implement pixel-perfect UI, handle complex business logic, and maintain security best practices.

## Objective

Implement the Figma-designed cancellation journey exactly on mobile + desktop, persist outcomes securely, and instrument the A/B downsell logic.

## What's Provided

This repository contains:
- ✅ Next.js + TypeScript + Tailwind scaffold
- ✅ `seed.sql` with users table (25/29 USD plans) and empty cancellations table
- ✅ Local Supabase configuration for development
- ✅ Basic Supabase client setup in `src/lib/supabase.ts`

## Tech Stack (Preferred)

- **Next.js** with App Router
- **React** with TypeScript
- **Tailwind CSS** for styling
- **Supabase** (Postgres + Row-Level Security)

> **Alternative stacks allowed** if your solution:
> 1. Runs with `npm install && npm run dev`
> 2. Persists to a Postgres-compatible database
> 3. Enforces table-level security

## Must-Have Features

### 1. Progressive Flow (Figma Design)
- Implement the exact cancellation journey from provided Figma
- Ensure pixel-perfect fidelity on both mobile and desktop
- Handle all user interactions and state transitions

### 2. Deterministic A/B Testing (50/50 Split)
- **On first entry**: Assign variant via cryptographically secure RNG
- **Persist** variant to `cancellations.downsell_variant` field
- **Reuse** variant on repeat visits (never re-randomize)

**Variant A**: No downsell screen
**Variant B**: Show "$10 off" offer
- Price $25 → $15, Price $29 → $19
- **Accept** → Log action, take user back to profile page (NO ACTUAL PAYMENT PROCESSING REQUIRED)
- **Decline** → Continue to reason selection in flow

### 3. Data Persistence
- Mark subscription as `pending_cancellation` in database
- Create cancellation record with:
  - `user_id`
  - `downsell_variant` (A or B)
  - `reason` (from user selection)
  - `accepted_downsell` (boolean)
  - `created_at` (timestamp)

### 4. Security Requirements
- **Row-Level Security (RLS)** policies
- **Input validation** on all user inputs
- **CSRF/XSS protection**
- Secure handling of sensitive data

### 5. Reproducible Setup
- `npm run db:setup` creates schema and seed data (local development)
- Clear documentation for environment setup

## Out of Scope

- **Payment processing** - Stub with comments only
- **User authentication** - Use mock user data
- **Email notifications** - Not required
- **Analytics tracking** - Focus on core functionality

## Getting Started

1. **Clone this repository** `git clone [repo]`
2. **Install dependencies**: `npm install`
3. **Set up local database**: `npm run db:setup`
4. **Start development**: `npm run dev`

## Database Schema

The `seed.sql` file provides a **starting point** with:
- `users` table with sample users
- `subscriptions` table with $25 and $29 plans
- `cancellations` table (minimal structure - **you'll need to expand this**)
- Basic RLS policies (enhance as needed)

### Important: Schema Design Required

The current `cancellations` table is intentionally minimal. You'll need to:
- **Analyze the cancellation flow requirements** from the Figma design
- **Design appropriate table structure(s)** to capture all necessary data
- **Consider data validation, constraints, and relationships**
- **Ensure the schema supports the A/B testing requirements**

## Evaluation Criteria

- **Functionality (40%)**: Feature completeness and correctness
- **Code Quality (25%)**: Clean, maintainable, well-structured code
- **Pixel/UX Fidelity (15%)**: Accuracy to Figma design
- **Security (10%)**: Proper RLS, validation, and protection
- **Documentation (10%)**: Clear README and code comments

## Deliverables

1. **Working implementation** in this repository
2. **NEW One-page README.md (replace this)** (≤600 words) explaining:
   - Architecture decisions
   - Security implementation
   - A/B testing approach
3. **Clean commit history** with meaningful messages

## Timeline

Submit your solution within **72 hours** of receiving this repository.

## AI Tooling

Using Cursor, ChatGPT, Copilot, etc. is **encouraged**. Use whatever accelerates your development—just ensure you understand the code and it runs correctly.

## Questions?

Review the challenge requirements carefully. If you have questions about specific implementation details, make reasonable assumptions and document them in your README.

---

**Good luck!** We're excited to see your implementation.
