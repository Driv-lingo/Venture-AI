# VentureAI Setup Guide

Complete setup instructions for running VentureAI locally.

## Prerequisites

- Node.js 20.9.0 or higher
- PostgreSQL database (local or cloud)
- Redis instance (Upstash recommended)
- Anthropic API key

## Step-by-Step Setup

### 1. Install Dependencies

```bash
npm install
npm install -D tsx
```

### 2. Set Up Environment Variables

Create a `.env` file in the root directory:

```bash
# Copy the example file
cp .env.example .env
```

Edit `.env` and fill in your credentials:

```env
# Database - Use one of these options:
# Option 1: Local PostgreSQL
DATABASE_URL="postgresql://postgres:password@localhost:5432/ventureai"

# Option 2: Neon (Serverless PostgreSQL)
# DATABASE_URL="postgresql://user:password@ep-xxx.us-east-2.aws.neon.tech/ventureai"

# Option 3: Supabase
# DATABASE_URL="postgresql://postgres:password@db.xxx.supabase.co:5432/postgres"

# Redis - Upstash (Get free account at https://upstash.com)
REDIS_URL="https://xxx.upstash.io"
REDIS_TOKEN="your-token-here"

# Anthropic Claude API (Get key at https://console.anthropic.com)
ANTHROPIC_API_KEY="sk-ant-api03-xxx"

# NextAuth.js
# Generate secret: openssl rand -base64 32
NEXTAUTH_SECRET="your-random-secret-here"
NEXTAUTH_URL="http://localhost:3000"

# Optional: OAuth Providers
GOOGLE_CLIENT_ID="your-google-client-id"
GOOGLE_CLIENT_SECRET="your-google-client-secret"
GITHUB_CLIENT_ID="your-github-client-id"
GITHUB_CLIENT_SECRET="your-github-client-secret"
```

### 3. Set Up Database

#### Option A: Using Neon (Recommended for Development)

1. Go to [Neon](https://neon.tech) and create a free account
2. Create a new project
3. Copy the connection string to your `.env` file

#### Option B: Local PostgreSQL

1. Install PostgreSQL locally
2. Create a database:
```bash
createdb ventureai
```

#### Run Migrations

```bash
npm run db:generate
npm run db:push
```

### 4. Seed the Database

Populate with sample opportunities:

```bash
npx prisma db seed
```

### 5. Set Up Redis (Upstash)

1. Go to [Upstash](https://upstash.com) and create a free account
2. Create a new Redis database
3. Copy the REST URL and token to your `.env` file

### 6. Get Anthropic API Key

1. Go to [Anthropic Console](https://console.anthropic.com)
2. Create an account and get API key
3. Add to `.env` file

### 7. Start Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

## Testing the Application

### 1. Create an Account

1. Navigate to http://localhost:3000
2. Click "Get Started"
3. Fill in signup form
4. Complete onboarding flow

### 2. Explore Opportunities

1. Go to "Opportunities" page
2. Click on any opportunity card
3. Wait for AI validation (uses Claude API)
4. Review validation results

### 3. Launch a Business

1. After validation, click "Proceed to Launch"
2. Business will be created in "planning" status
3. View in Dashboard

## Useful Commands

```bash
# Development
npm run dev                 # Start dev server
npm run build              # Build for production
npm run start              # Start production server

# Database
npm run db:generate        # Generate Prisma client
npm run db:push            # Push schema to database
npm run db:migrate         # Create migration
npm run db:studio          # Open Prisma Studio
npx prisma db seed         # Seed database

# Type Checking & Testing
npm run type-check         # Check TypeScript types
npm run lint               # Run ESLint
npm run test               # Run unit tests
npm run test:e2e           # Run E2E tests
```

## Troubleshooting

### Database Connection Issues

**Error: Can't reach database server**

- Check your `DATABASE_URL` is correct
- Ensure PostgreSQL is running (if local)
- Check firewall settings

**Solution:**
```bash
# Test connection
npx prisma db pull
```

### Redis Connection Issues

**Error: Redis connection failed**

- Verify `REDIS_URL` and `REDIS_TOKEN` are correct
- Check Upstash dashboard for correct credentials
- Ensure you're using the REST API URL (not the native Redis URL)

### Prisma Client Not Generated

**Error: Cannot find module '@prisma/client'**

```bash
npm run db:generate
```

### Node Version Issues

**Error: Unsupported engine**

VentureAI requires Node.js 20.9.0 or higher. Update Node.js:

```bash
# Using nvm
nvm install 20
nvm use 20

# Or download from nodejs.org
```

### TypeScript Errors

If you see TypeScript errors after setup:

```bash
npm run db:generate
npm run type-check
```

## Project Structure

```
windsurf-project/
├── app/                      # Next.js App Router
│   ├── api/                 # API routes
│   ├── auth/                # Authentication pages
│   ├── dashboard/           # Dashboard page
│   ├── onboarding/          # Onboarding flow
│   ├── opportunities/       # Opportunities page
│   └── page.tsx             # Landing page
├── components/
│   └── ui/                  # shadcn/ui components
├── lib/
│   ├── prisma.ts            # Database client
│   ├── redis.ts             # Redis client
│   ├── anthropic.ts         # AI client
│   ├── auth.ts              # Auth config
│   ├── queue.ts             # Job queues
│   └── matching.ts          # Matching algorithm
├── prisma/
│   ├── schema.prisma        # Database schema
│   └── seed.ts              # Seed data
└── .env                     # Environment variables
```

## Features to Test

### ✅ Authentication
- Sign up with email/password
- Sign in
- Session management

### ✅ Onboarding
- Multi-step form
- Skills selection
- Interests selection
- Capital & time commitment
- Experience level

### ✅ Opportunities
- Browse matched opportunities
- Match score calculation
- AI validation with Claude
- Revenue projections
- Risk assessment

### ✅ Dashboard
- Business overview
- Stats cards
- Business list

### ✅ Redis Features
- User profile caching
- Opportunity caching
- Rate limiting (try validating 11 times in a day)
- Validation result caching

## Next Steps

After setup, you can:

1. **Customize Opportunities**: Edit `prisma/seed.ts` to add your own opportunities
2. **Implement Business Launch Wizard**: Build the 8-step launch flow
3. **Add Real-Time Metrics**: Implement metrics tracking with Redis
4. **Build Leaderboards**: Add top opportunities/businesses rankings
5. **Implement Background Jobs**: Set up BullMQ workers for opportunity detection

## Support

For issues or questions:
- Check the main [README.md](./README.md)
- Review the [Prisma docs](https://www.prisma.io/docs)
- Check [Next.js docs](https://nextjs.org/docs)
- Review [Upstash Redis docs](https://docs.upstash.com/redis)

## Production Deployment

See [README.md](./README.md) for Vercel deployment instructions.
