# VentureAI Deployment Guide

Complete guide for deploying VentureAI to production on Vercel.

## Prerequisites

- GitHub account
- Vercel account (free tier works)
- Neon or Supabase account (for PostgreSQL)
- Upstash account (for Redis)
- Anthropic API key

## Deployment Steps

### 1. Prepare Your Repository

```bash
# Initialize git (if not already done)
git init

# Add all files
git add .

# Commit
git commit -m "Initial commit: VentureAI application"

# Create GitHub repository and push
git remote add origin https://github.com/yourusername/ventureai.git
git branch -M main
git push -u origin main
```

### 2. Set Up Production Database (Neon)

1. Go to [Neon](https://neon.tech)
2. Create a new project: "ventureai-production"
3. Copy the connection string
4. Save it for Vercel environment variables

### 3. Set Up Production Redis (Upstash)

1. Go to [Upstash](https://upstash.com)
2. Create a new Redis database
3. Select a region close to your users
4. Copy REST URL and token
5. Save for Vercel environment variables

### 4. Deploy to Vercel

#### Via Vercel Dashboard

1. Go to [Vercel](https://vercel.com)
2. Click "Add New Project"
3. Import your GitHub repository
4. Configure project:
   - **Framework Preset**: Next.js
   - **Root Directory**: ./
   - **Build Command**: `npm run build`
   - **Output Directory**: .next

5. Add Environment Variables (click "Environment Variables"):

```env
# Database
DATABASE_URL=postgresql://user:password@ep-xxx.us-east-2.aws.neon.tech/ventureai

# Redis
REDIS_URL=https://xxx.upstash.io
REDIS_TOKEN=your-upstash-token

# Anthropic
ANTHROPIC_API_KEY=sk-ant-api03-xxx

# NextAuth
NEXTAUTH_SECRET=your-production-secret-here
NEXTAUTH_URL=https://your-app.vercel.app

# Optional: OAuth
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
GITHUB_CLIENT_ID=your-github-client-id
GITHUB_CLIENT_SECRET=your-github-client-secret
```

6. Click "Deploy"

#### Via Vercel CLI

```bash
# Install Vercel CLI
npm i -g vercel

# Login
vercel login

# Deploy
vercel

# Follow prompts and add environment variables when asked
```

### 5. Run Database Migrations

After first deployment:

```bash
# Set DATABASE_URL locally to production database
export DATABASE_URL="your-production-database-url"

# Run migrations
npx prisma migrate deploy

# Seed database (optional)
npx prisma db seed
```

Or use Vercel CLI:

```bash
vercel env pull .env.production
npm run db:migrate
```

### 6. Configure OAuth Providers (Optional)

#### Google OAuth

1. Go to [Google Cloud Console](https://console.cloud.google.com)
2. Create a new project
3. Enable Google+ API
4. Create OAuth 2.0 credentials
5. Add authorized redirect URI:
   ```
   https://your-app.vercel.app/api/auth/callback/google
   ```
6. Copy Client ID and Secret to Vercel environment variables

#### GitHub OAuth

1. Go to GitHub Settings > Developer settings > OAuth Apps
2. Create new OAuth App
3. Set Authorization callback URL:
   ```
   https://your-app.vercel.app/api/auth/callback/github
   ```
4. Copy Client ID and Secret to Vercel environment variables

### 7. Set Up Custom Domain (Optional)

1. In Vercel project settings, go to "Domains"
2. Add your custom domain
3. Follow DNS configuration instructions
4. Update `NEXTAUTH_URL` environment variable to your custom domain

### 8. Configure Monitoring

#### Vercel Analytics

1. In Vercel project settings, enable "Analytics"
2. Free tier includes basic metrics

#### Sentry (Error Tracking)

```bash
npm install @sentry/nextjs
npx @sentry/wizard@latest -i nextjs
```

Add to environment variables:
```env
SENTRY_DSN=your-sentry-dsn
```

### 9. Performance Optimization

#### Enable Edge Functions (Optional)

For faster response times, convert API routes to Edge Runtime:

```typescript
// app/api/opportunities/route.ts
export const runtime = 'edge';
```

#### Configure Caching

Vercel automatically caches static assets. For API routes:

```typescript
export const revalidate = 3600; // Cache for 1 hour
```

### 10. Security Checklist

- [ ] All environment variables set in Vercel
- [ ] `NEXTAUTH_SECRET` is strong and unique
- [ ] Database has SSL enabled
- [ ] Redis has TLS enabled
- [ ] Rate limiting is active
- [ ] CORS is properly configured
- [ ] OAuth redirect URIs are correct

## Post-Deployment

### Verify Deployment

1. Visit your deployed URL
2. Test signup/signin
3. Complete onboarding
4. Browse opportunities
5. Test AI validation
6. Check dashboard

### Monitor Application

```bash
# View deployment logs
vercel logs

# View function logs
vercel logs --follow
```

### Update Deployment

```bash
# Push changes to GitHub
git add .
git commit -m "Update feature"
git push

# Vercel auto-deploys on push to main branch
```

## Environment-Specific Configuration

### Development
```env
NEXTAUTH_URL=http://localhost:3000
```

### Preview (Vercel)
```env
NEXTAUTH_URL=https://your-app-git-branch.vercel.app
```

### Production
```env
NEXTAUTH_URL=https://your-app.vercel.app
```

## Scaling Considerations

### Database

**Neon Autoscaling:**
- Free tier: 0.5 GB storage, 1 compute unit
- Pro tier: Autoscales compute based on load

**Connection Pooling:**
Already configured in Prisma. For high traffic:

```env
DATABASE_URL="postgresql://user:password@host/db?pgbouncer=true&connection_limit=10"
```

### Redis

**Upstash Pricing:**
- Free tier: 10K commands/day
- Pay-as-you-go: $0.2 per 100K commands

**Optimization:**
- Use appropriate TTLs
- Implement cache warming
- Monitor hit rates

### API Rate Limits

Current limits (configured in `lib/redis.ts`):
- API calls: 100/hour per user
- Validations: 10/day per user
- Launches: 5/week per user

Adjust based on your needs and Anthropic API limits.

## Troubleshooting

### Build Failures

**Error: Prisma Client not generated**
```bash
# Add to package.json
"scripts": {
  "postinstall": "prisma generate"
}
```

**Error: Environment variables not found**
- Check Vercel dashboard environment variables
- Ensure variables are set for "Production" environment
- Redeploy after adding variables

### Runtime Errors

**Error: Database connection failed**
- Verify DATABASE_URL is correct
- Check Neon database is active
- Ensure SSL is enabled

**Error: Redis connection timeout**
- Verify REDIS_URL and REDIS_TOKEN
- Check Upstash dashboard for outages
- Ensure region is correct

### Performance Issues

**Slow API responses:**
- Enable Edge Runtime for API routes
- Implement Redis caching
- Optimize database queries with indexes

**High costs:**
- Monitor Anthropic API usage
- Implement request caching
- Add rate limiting

## Backup Strategy

### Database Backups

Neon provides automatic backups:
- Point-in-time recovery
- 7-day retention (free tier)
- 30-day retention (pro tier)

Manual backup:
```bash
pg_dump $DATABASE_URL > backup.sql
```

### Redis Backups

Upstash provides:
- Automatic daily backups
- 7-day retention

## Rollback Procedure

### Vercel Rollback

1. Go to Vercel dashboard
2. Click "Deployments"
3. Find previous working deployment
4. Click "..." > "Promote to Production"

### Database Rollback

```bash
# Rollback last migration
npx prisma migrate resolve --rolled-back migration_name

# Apply previous migration
npx prisma migrate deploy
```

## Cost Estimation

### Free Tier (Suitable for MVP)

- **Vercel**: Free (100GB bandwidth, unlimited deployments)
- **Neon**: Free (0.5GB storage, 1 compute unit)
- **Upstash**: Free (10K commands/day)
- **Anthropic**: Pay-per-use (~$0.003 per validation)

**Estimated monthly cost**: $0-50 (depending on usage)

### Production Scale (1000 users)

- **Vercel Pro**: $20/month
- **Neon Pro**: $19/month (autoscaling)
- **Upstash**: $10-30/month
- **Anthropic**: $50-200/month

**Estimated monthly cost**: $100-270

## Support & Resources

- [Vercel Documentation](https://vercel.com/docs)
- [Neon Documentation](https://neon.tech/docs)
- [Upstash Documentation](https://docs.upstash.com)
- [Next.js Deployment](https://nextjs.org/docs/deployment)
- [Prisma Deployment](https://www.prisma.io/docs/guides/deployment)

## Success Checklist

- [ ] Application deployed to Vercel
- [ ] Database migrations run successfully
- [ ] Redis connection working
- [ ] Authentication working (signup/signin)
- [ ] AI validation working
- [ ] Environment variables secured
- [ ] Custom domain configured (optional)
- [ ] Monitoring enabled
- [ ] Backups configured
- [ ] Performance optimized

🎉 Your VentureAI application is now live!
