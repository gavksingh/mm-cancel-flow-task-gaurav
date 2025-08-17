# 🏗️ Migrate Mate - Subscription Cancellation Flow

> **🎯 Status**: Ready for testing | **⏱️ Setup Time**: 3-5 minutes | **🔧 Dependencies**: Node.js + Docker

A progressive, A/B tested subscription cancellation flow built with Next.js, TypeScript, and Supabase. Features pixel-perfect responsive design, deterministic A/B testing, and robust security implementation.

## 🔗 Demo Link : [Short Demo](https://drive.google.com/file/d/194tNmC7gX2Kx6C0qI5MDJLmIJNpMcqN9/view?usp=sharing)

> **Prerequisites:** Node.js, Docker Desktop

## 📋 System Requirements

- **Node.js**: v18+ ([Download](https://nodejs.org/))
- **Docker Desktop**: Latest ([Download](https://www.docker.com/products/docker-desktop))

## 🚀 Quick Start for Testers

**Prerequisites**: 
- Node.js (v18+)
- Docker Desktop ([Install here](https://www.docker.com/products/docker-desktop))

```bash
# 1. Clone and install
git clone <repo-url>
cd cancel-flow-task-main
npm install

# 2. Setup database and start server (one command does everything)
npm run setup
# Note: If prompted during setup, press ENTER to accept defaults

# 3. Setup automatically starts the dev server
# Visit: http://localhost:3000/cancel
```

**🎯 Test URL**: `http://localhost:3000/cancel`

## 🎨**New Feature (Not mentioned in instructions.md): Enhanced Pending Cancellation UX** 🎨
1. Complete any cancellation flow normally
2. Try to cancel again (`/cancel` page)
3. Should see enhanced "Cancellation Request Received" message

## 🛠️ Available Commands

| Command | Purpose |
|---------|---------|
| `npm run setup` | **One-click setup**: Install deps + database + start dev server |
| `npm run dev` | Start development server (only if not already running) |
| `npm run db:fresh` | **Clean reset** - Use when testing from scratch |
| `npm run db:cleanup` | **Fresh state** - Reset to 3 active subscriptions, 0 cancellations |
| `npm run db:start` | Start Supabase only |
| `npm run db:stop` | Stop Supabase only |

> **Note**: `npm run setup` automatically starts the development server. No need to run `npm run dev` separately.

## 🏗️ Architecture Decisions

### **Tech Stack Rationale**
- **Next.js 15 + App Router**: Server-side rendering, built-in API routes, excellent TypeScript support
- **Supabase (PostgreSQL)**: Instant PostgreSQL with built-in RLS, real-time capabilities, Docker-based local development
- **Tailwind CSS**: Rapid, consistent styling for pixel-perfect Figma implementation
- **TypeScript**: End-to-end type safety, reducing runtime errors

### **Component Architecture**
- **Step-based Modal System**: Each cancellation step is isolated component
- **Centralized State Management**: React Context for global flow state
- **Local UI State**: Components handle their own UI interactions
- **Clear Separation**: Business logic separated from presentation

```
CancellationContext (Global State)
├── CancellationModal (Orchestrator)
├── ProgressBar (Visual feedback)
└── Steps/
    ├── JobCheckStep
    ├── DownsellStep
    ├── SurveyStep
    ├── ReasonStep
    └── SuccessStep
```

## 🔒 Security Implementation

### **Row-Level Security (RLS)**
```sql
-- Users can only access their own data
CREATE POLICY user_cancellations ON cancellations 
FOR ALL USING (auth.uid() = user_id);

-- Subscription access restricted to owners
CREATE POLICY user_subscriptions ON subscriptions 
FOR ALL USING (auth.uid() = user_id);
```

### **Multi-Layer Validation**
- **Frontend**: React controlled components with real-time validation
- **API Layer**: Request body validation and sanitization  
- **Database**: Check constraints and foreign key relationships
- **XSS Protection**: All user inputs sanitized, no dangerouslySetInnerHTML

### **CSRF Protection**
- Next.js built-in CSRF protection via SameSite cookies
- Origin header verification on API routes

## 🧬 A/B Testing Implementation

### **Deterministic Assignment**
```typescript
// Cryptographically secure randomization
const variant = crypto.randomInt(2) === 0 ? 'A' : 'B';

// Persistent storage - same user = same variant
await supabase
  .from('cancellations')
  .insert({ downsell_variant: variant })
```

**Key Features:**
- ✅ **Persistence**: Variant stored in database on first assignment
- ✅ **Consistency**: Same user always receives same variant  
- ✅ **No Re-randomization**: Database check prevents variant switching

## 🧪 Testing Guide

### 1. **A/B Testing Variants**
- **Variant A**: Skips downsell → Direct to survey
- **Variant B**: Shows $10 discount offer ($25→$15, $29→$19)

**How to Test Both Variants:**
```bash
# Reset for new test session
npm run db:fresh

# Visit /cancel - you'll be randomly assigned A or B
# To test the other variant, reset database and visit again
```

### 2. **Test Scenarios**

#### **Scenario 1: Found a Job Path**
1. Select "I found a job" → Should skip downsell entirely
2. Continue to feedback step
3. Verify no downsell tracking in database

#### **Scenario 2: Still Searching + Variant A**
1. Select "I'm still job searching" 
2. Should go directly to survey (no downsell)
3. Continue through reason selection

#### **Scenario 3: Still Searching + Variant B** 
1. Select "I'm still job searching"
2. Should see downsell offer ($25→$15 or $29→$19)
3. Test both "Accept" and "Decline" paths
4. Verify `downsell_shown=true` and `accepted_downsell` tracking

#### **Scenario 4: Enhanced Pending Cancellation UX** 🎨
1. Complete any cancellation flow normally
2. Try to cancel again (`/cancel` page)
3. Should see enhanced "Cancellation Request Received" message
4. **Desktop**: Icon + title in one line, responsive image, full-width button
5. **Mobile**: Compact layout, single action button

#### **Scenario 5: "Other" Reason Input Field** ✏️
1. Navigate to cancellation reasons step (via flow or direct)
2. Select "Other" as cancellation reason
3. **Should see**: Textarea appears with "Please tell us about your reason for cancelling*"
4. **Test validation**: Enter <25 characters, try to continue → see error
5. **Test success**: Enter ≥25 characters → character count turns green, form submits
6. **Verify database**: Check `cancellations.feedback` contains "Other" text

### 3. **Database Verification**
```sql
-- Check user's cancellation record
SELECT * FROM cancellations WHERE user_id = 'test-user-1';

-- Verify subscription status
SELECT * FROM subscriptions WHERE user_id = 'test-user-1';
```

### **Downsell Logic**
Downsell shown **only when**:
1. User assigned **Variant B**
2. User indicates **"still job searching"**
3. No previous downsell acceptance recorded

#### **3. Database Cleanup Tools**
- **`npm run db:cleanup`**: Remove duplicates, clean orphaned records
- **`npm run db:fresh`**: Complete reset for clean testing
- **Conflict Resolution**: `ON CONFLICT (user_id, status) DO NOTHING`

## 📊 Data Flow & Persistence

```
User Action → Context State → API Route → Database
     ↓              ↓            ↓         ↓
UI Update ← Component ← Response ← Supabase
```

**Critical Data Points Captured:**
- `downsell_variant` (A/B assignment)
- `job_status` (found job vs still searching)
- `downsell_shown` (actual display tracking)
- `accepted_downsell` (conversion tracking)
- `reason` (cancellation reason)
- `feedback` (user comments)

## 🎯 Key Features Implemented

- ✅ **Pixel-perfect responsive design** matching Figma
- ✅ **Deterministic A/B testing** with persistence
- ✅ **Complete data capture** (survey, feedback, job status)
- ✅ **Secure database operations** with RLS
- ✅ **Input validation** and sanitization
- ✅ **Comprehensive error handling**
- ✅ **Mock user system** for testing

## ⚡ Performance Optimizations

- **Image Optimization**: Next.js Image component with automatic WebP conversion
- **Lazy Loading**: Step components load on-demand
- **Turbopack**: Faster development builds (`--turbopack` flag)
- **Database Indexing**: Optimized queries on frequently accessed fields

## 🚨 Troubleshooting

### **Setup Fails - Docker Not Found**
```bash
# Error: "Docker is not installed or not running!"
# Solution: Install Docker Desktop and make sure it's running
```
1. Download Docker Desktop from [docker.com](https://www.docker.com/products/docker-desktop)
2. Install and start Docker Desktop
3. Wait for Docker to fully start (green icon in system tray)
4. Run `npm run setup` again

### **Setup Fails - Supabase Config Missing**
```bash
# Error: "cannot read config in ... open supabase/config.toml: no such file or directory"
# OR: "unknown flag: --no-prompt"
# Solution: Supabase initialization failed
```
1. **Manual initialization**: `npx supabase init` (press ENTER for defaults)
2. **Verify creation**: Check if `supabase/config.toml` exists
3. **Check permissions** - Make sure you can write to the project directory
4. **Run setup again**: `npm run setup`

### **Setup Fails - Database Schema Errors**
```bash
# Error: "ERROR: relation 'subscriptions' does not exist"
# Solution: Seeding attempted before schema creation
```
1. **Reset database**: `npx supabase db reset`
2. **Run setup again**: `npm run setup`
3. **If persists**: `npx supabase stop && npm run setup`

**Note**: The setup script now prevents auto-seeding conflicts, but existing setups may need reset.

### **Setup Succeeds But App Shows Environment Errors**
```bash
# Error: "supabaseUrl is required" or "Unexpected token '<'"
# Solution: Environment variables not loaded properly
```
1. **Check .env.local exists**: `ls -la .env.local`
2. **Manually create if missing**: 
   ```bash
   echo "NEXT_PUBLIC_SUPABASE_URL=http://127.0.0.1:54321
   NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6ImFub24iLCJleHAiOjE5ODM4MTI5OTZ9.CRXP1A7WOeoJeXxjNni43kdQwgnWNReilDMblYTn_I0
   SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImV4cCI6MTk4MzgxMjk5Nn0.EGIM96RAZx35lJzdJsyH-qQwv8Hdp7fsn3W0YpN81IU" > .env.local
   ```
3. **Restart dev server**: Stop server (Ctrl+C) and run `npm run dev`

### **Setup Fails - Node.js Version**
```bash
# Error: Node version issues
# Solution: Use Node.js v18 or higher
```
1. Check version: `node --version`
2. If < v18, download from [nodejs.org](https://nodejs.org/)
3. Run `npm run setup` again

### **Port Already in Use**
```bash
# Error: "Port 3000 is already in use"
# Solution: Kill existing processes or use different port
```
1. Kill existing: `npx kill-port 3000`
2. Or restart: `npm run db:fresh`

### **API Returns Error**
```bash
# Check API health
curl http://localhost:3000/api/cancel
# Should return: {"price":2500,"subscription_id":"uuid","status":"active"}
```

### **Database Issues**
```bash
# Clean reset everything
npm run db:fresh

# Or clean just duplicates
npm run db:cleanup
```

### **Still Having Issues?**
1. **Check Docker is running**: Look for Docker whale icon in system tray
2. **Check ports**: Make sure 3000, 54321, 54322 are available
3. **Check Node version**: Must be v18+
4. **Try fresh setup**: `npm run db:fresh`

### **Check Logs**
API includes detailed logging:
- `ℹ️ [API]` - Information
- `⚠️ [API]` - Warnings (like multiple subscriptions)  
- `❌ [API]` - Errors

---

**🎉 Ready to test!** The application provides a robust, secure cancellation flow with comprehensive A/B testing and data persistence capabilities.
