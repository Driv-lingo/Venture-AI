# VentureAI - Quick Start Guide

Get VentureAI running in 5 minutes! ⚡

## Prerequisites

- Node.js 20+ installed
- Git installed

## 🚀 5-Minute Setup

### 1. Clone & Install (1 min)

```bash
git clone <your-repo-url>
cd windsurf-project
npm install
npm install -D tsx
```

### 2. Get Free Services (2 min)

#### Database - Neon (30 seconds)
1. Go to [neon.tech](https://neon.tech)
2. Sign up (GitHub OAuth is fastest)
3. Create project → Copy connection string

#### Redis - Upstash (30 seconds)
1. Go to [upstash.com](https://upstash.com)
2. Sign up (GitHub OAuth)
3. Create Redis database → Copy REST URL and token

#### AI - Anthropic (1 min)
1. Go to [console.anthropic.com](https://console.anthropic.com)
2. Sign up
3. Get API key from dashboard

### 3. Configure Environment (1 min)

```bash
# Copy example file
cp .env.example .env
```

Edit `.env` and add your credentials:

```env
# Paste your Neon connection string
DATABASE_URL="postgresql://user:password@ep-xxx.us-east-2.aws.neon.tech/ventureai"

# Paste your Upstash credentials
REDIS_URL="https://xxx.upstash.io"
REDIS_TOKEN="your-token"

# Paste your Anthropic API key
ANTHROPIC_API_KEY="sk-ant-api03-xxx"

# Generate a random secret (or use: openssl rand -base64 32)
NEXTAUTH_SECRET="your-random-secret-here"
NEXTAUTH_URL="http://localhost:3000"
```

### 4. Setup Database (1 min)

```bash
# Generate Prisma client
npm run db:generate

# Push schema to database
npm run db:push

# Seed with sample opportunities
npx prisma db seed
```

### 5. Start Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) 🎉

## ✅ Test the Application

### 1. Create Account
- Click "Get Started"
- Fill in name, email, password
- Click "Sign Up"

### 2. Complete Onboarding
- Select your skills (e.g., Marketing, Design, Coding)
- Select interests (e.g., Technology, E-commerce)
- Choose capital level (e.g., $1k-$5k)
- Select time commitment (e.g., Part Time)
- Choose experience (e.g., Intermediate)
- Click "Complete Setup"

### 3. Explore Opportunities
- You'll see 5 sample opportunities
- Each has a match score based on your profile
- Click any opportunity card

### 4. Validate with AI
- Wait 3-5 seconds for Claude AI analysis
- View validation scores:
  - Market Demand
  - Competitor Gaps
  - Profitability
  - Risk Score
- Review revenue projections
- See risk assessment
- Check action plan

### 5. Launch Business
- Click "Proceed to Launch"
- Business created in Dashboard
- View in "Your Businesses" section

## 🎯 What You Can Do

✅ **Sign up/Sign in** - Full authentication
✅ **Complete onboarding** - 5-step wizard
✅ **Browse opportunities** - AI-matched to your profile
✅ **Validate ideas** - Claude AI analysis
✅ **Launch businesses** - Track in dashboard
✅ **View dashboard** - Stats and business list

## 🔴 Redis Features to Test

### 1. Caching
- Browse opportunities → Fast load (cached)
- Update profile → Opportunities refresh
- Validate opportunity → Result cached for 24h

### 2. Rate Limiting
Try these to see rate limits:
- Make 100+ API calls in an hour → Rate limited
- Validate 11 opportunities in a day → Rate limited
- Launch 6 businesses in a week → Rate limited

### 3. Real-Time Features
- Dashboard updates automatically
- Business metrics refresh every 5 minutes
- Match scores recalculate on profile changes

## 🐛 Troubleshooting

### "Cannot connect to database"
```bash
# Check your DATABASE_URL in .env
# Ensure Neon database is active
npx prisma db pull  # Test connection
```

### "Redis connection failed"
```bash
# Verify REDIS_URL and REDIS_TOKEN
# Check Upstash dashboard
# Ensure you're using REST API URL
```

### "Prisma Client not found"
```bash
npm run db:generate
```

### "Port 3000 already in use"
```bash
# Kill existing process or use different port
npm run dev -- -p 3001
```

## 📊 Sample Data

The seed script creates 5 opportunities:

1. **AI-Powered Resume Builder** - Career Tech
2. **Notion Templates Marketplace** - Productivity
3. **Local Service Booking Platform** - Local Services
4. **Newsletter Sponsorship Marketplace** - Creator Economy
5. **AI Social Media Content Generator** - Marketing Tech

Each has realistic data:
- Revenue estimates
- Startup costs
- Time to launch
- Market size
- Competition level

## 🎨 UI Features

- **Dark theme** with gradient backgrounds
- **Glassmorphism** cards
- **Smooth animations**
- **Responsive design** (mobile-friendly)
- **Toast notifications**
- **Loading states**
- **Progress indicators**

## 📱 Pages to Explore

- `/` - Landing page
- `/auth/signup` - Sign up
- `/auth/signin` - Sign in
- `/onboarding` - Onboarding wizard
- `/dashboard` - Main dashboard
- `/opportunities` - Browse opportunities

## 🔧 Useful Commands

```bash
# Development
npm run dev              # Start dev server
npm run build            # Build for production

# Database
npm run db:generate      # Generate Prisma client
npm run db:push          # Push schema changes
npm run db:studio        # Open Prisma Studio (database GUI)
npx prisma db seed       # Reseed database

# Debugging
npm run type-check       # Check TypeScript
npm run lint             # Run linter
```

## 📚 Next Steps

After testing the MVP:

1. **Read the docs**:
   - `README.md` - Full documentation
   - `SETUP.md` - Detailed setup
   - `DEPLOYMENT.md` - Deploy to production

2. **Customize**:
   - Add your own opportunities in `prisma/seed.ts`
   - Modify matching algorithm in `lib/matching.ts`
   - Customize UI colors in `tailwind.config.ts`

3. **Extend**:
   - Build the 8-step launch wizard
   - Add opportunity detection engine
   - Implement real-time metrics
   - Create leaderboards

4. **Deploy**:
   - Push to GitHub
   - Deploy to Vercel
   - Set up production database
   - Configure custom domain

## 💡 Pro Tips

- **Use Prisma Studio**: `npm run db:studio` for visual database management
- **Check Redis**: Monitor usage in Upstash dashboard
- **Test rate limits**: Try exceeding limits to see protection
- **Explore validation**: Each validation costs ~$0.003 in API calls
- **Profile matters**: Better profile = better opportunity matches

## 🎉 You're Ready!

You now have a fully functional AI-powered business launcher platform!

**What's working:**
- ✅ Authentication
- ✅ Onboarding
- ✅ Opportunity matching
- ✅ AI validation
- ✅ Business management
- ✅ Redis caching & rate limiting
- ✅ Beautiful UI

**Have fun building businesses!** 🚀

---

Need help? Check:
- `README.md` - Comprehensive docs
- `SETUP.md` - Detailed setup guide
- `PROJECT_SUMMARY.md` - Feature overview
