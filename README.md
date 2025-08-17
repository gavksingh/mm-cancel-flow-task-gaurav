# 🏗️ Migrate Mate - Subscription Cancellation Flow

A progressive, A/B tested subscription cancellation flow built with Next.js, TypeScript, and Supabase. Features pixel-perfect responsive design, deterministic A/B testing, and robust security implementation.

## 🚀 Quick Start for Testers

```bash
# 1. Install dependencies
npm install

# 2. Setup database and start everything
npm run setup

# 3. Access the application
# Visit: http://localhost:3000/cancel
```

**🎯 Test URL**: `http://localhost:3000/cancel`

## 🛠️ Available Commands

| Command | Purpose |
|---------|---------|
| `npm run setup` | Complete setup (install + database) |
| `npm run dev` | Start development server |
| `npm run db:fresh` | **Clean reset** - Use when testing from scratch |
| `npm run db:cleanup` | Remove duplicate data issues |
| `npm run db:start` | Start Supabase only |
| `npm run db:stop` | Stop Supabase only |

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
    ├── DownsellStep (Variant B only)
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

### **Check Logs**
API includes detailed logging:
- `ℹ️ [API]` - Information
- `⚠️ [API]` - Warnings (like multiple subscriptions)  
- `❌ [API]` - Errors

---

**🎉 Ready to test!** The application provides a robust, secure cancellation flow with comprehensive A/B testing and data persistence capabilities.
