# VentureAI Production Checklist

Complete checklist before deploying to production.

## ✅ Pre-Deployment Checklist

### 1. Environment Variables
- [ ] All environment variables set in Vercel/hosting platform
- [ ] `NEXTAUTH_SECRET` is strong and unique (use: `openssl rand -base64 32`)
- [ ] `NEXTAUTH_URL` points to production domain
- [ ] `DATABASE_URL` uses production database with SSL
- [ ] `REDIS_URL` and `REDIS_TOKEN` are from production Redis instance
- [ ] `ANTHROPIC_API_KEY` is valid and has sufficient credits
- [ ] OAuth credentials (if using) are configured for production domain

### 2. Database
- [ ] Production database created (Neon/Supabase)
- [ ] Database migrations run: `npx prisma migrate deploy`
- [ ] Database seeded (optional): `npx prisma db seed`
- [ ] Connection pooling enabled
- [ ] SSL/TLS enabled
- [ ] Backups configured (automatic with Neon/Supabase)

### 3. Redis
- [ ] Production Redis instance created (Upstash)
- [ ] Appropriate region selected (close to users)
- [ ] TLS enabled
- [ ] Daily backups enabled
- [ ] Monitoring enabled

### 4. Security
- [ ] HTTPS enabled (automatic with Vercel)
- [ ] CORS configured properly
- [ ] Rate limiting active
- [ ] Input validation on all forms (Zod)
- [ ] SQL injection prevention (Prisma ORM)
- [ ] XSS protection (React escaping)
- [ ] CSRF protection implemented
- [ ] Passwords hashed (bcrypt)
- [ ] Session security (JWT with httpOnly cookies)

### 5. Performance
- [ ] Images optimized (Next.js Image component)
- [ ] Code splitting enabled (automatic with Next.js)
- [ ] Redis caching configured
- [ ] API routes optimized
- [ ] Database queries indexed
- [ ] Static pages cached
- [ ] Edge runtime considered for API routes

### 6. Monitoring & Analytics
- [ ] Error tracking configured (Sentry recommended)
- [ ] Analytics enabled (Vercel Analytics or Google Analytics)
- [ ] Logging configured
- [ ] Uptime monitoring (UptimeRobot, Pingdom)
- [ ] Performance monitoring (Vercel Speed Insights)

### 7. Testing
- [ ] All pages load without errors
- [ ] Authentication flow works
- [ ] Onboarding completes successfully
- [ ] Opportunities load and match correctly
- [ ] AI validation works
- [ ] Business creation works
- [ ] Status updates work
- [ ] Launch wizard functional
- [ ] Mobile responsive
- [ ] Cross-browser tested

### 8. Content & SEO
- [ ] Meta tags configured
- [ ] Open Graph tags added
- [ ] Favicon added
- [ ] robots.txt configured
- [ ] sitemap.xml generated
- [ ] 404 page styled
- [ ] Error pages styled

### 9. Legal & Compliance
- [ ] Privacy Policy added
- [ ] Terms of Service added
- [ ] Cookie consent (if EU users)
- [ ] GDPR compliance (if EU users)
- [ ] Data retention policy
- [ ] User data export capability

### 10. Documentation
- [ ] README updated
- [ ] API documentation complete
- [ ] Environment variables documented
- [ ] Deployment guide updated
- [ ] Troubleshooting guide available

## 🚀 Deployment Steps

### Step 1: Final Code Review
```bash
# Type check
npm run type-check

# Lint
npm run lint

# Build locally
npm run build

# Test build
npm run start
```

### Step 2: Push to GitHub
```bash
git add .
git commit -m "Production ready"
git push origin main
```

### Step 3: Deploy to Vercel
1. Connect GitHub repository
2. Configure environment variables
3. Deploy
4. Test deployment URL

### Step 4: Run Database Migrations
```bash
# Set production DATABASE_URL
export DATABASE_URL="your-production-url"

# Run migrations
npx prisma migrate deploy

# Seed (optional)
npx prisma db seed
```

### Step 5: Configure Custom Domain (Optional)
1. Add domain in Vercel
2. Configure DNS
3. Update `NEXTAUTH_URL`
4. Update OAuth redirect URIs

### Step 6: Post-Deployment Testing
- [ ] Visit production URL
- [ ] Test signup/signin
- [ ] Complete onboarding
- [ ] Browse opportunities
- [ ] Validate an opportunity
- [ ] Create a business
- [ ] Test status updates
- [ ] Test launch wizard
- [ ] Check error pages
- [ ] Test on mobile

### Step 7: Monitoring Setup
- [ ] Configure error alerts
- [ ] Set up uptime monitoring
- [ ] Enable analytics
- [ ] Monitor API usage (Anthropic)
- [ ] Monitor Redis usage
- [ ] Monitor database usage

## 📊 Production Metrics to Track

### Application Metrics
- **Response Time**: Target <500ms for API routes
- **Cache Hit Rate**: Target >85% for Redis
- **Error Rate**: Target <1%
- **Uptime**: Target 99.9%

### Business Metrics
- **User Signups**: Daily/weekly/monthly
- **Onboarding Completion**: Target >70%
- **Opportunities Validated**: Per user
- **Businesses Launched**: Per user
- **Active Users**: Daily/monthly

### Cost Metrics
- **Vercel**: Bandwidth and function invocations
- **Database**: Storage and compute
- **Redis**: Commands per day
- **Anthropic**: API calls and tokens

## 🔧 Production Configuration

### Next.js Config
```javascript
// next.config.js
module.exports = {
  reactStrictMode: true,
  poweredByHeader: false,
  compress: true,
  images: {
    domains: ['your-cdn-domain.com'],
    formats: ['image/avif', 'image/webp'],
  },
  headers: async () => [
    {
      source: '/:path*',
      headers: [
        {
          key: 'X-DNS-Prefetch-Control',
          value: 'on'
        },
        {
          key: 'Strict-Transport-Security',
          value: 'max-age=63072000; includeSubDomains; preload'
        },
        {
          key: 'X-Frame-Options',
          value: 'SAMEORIGIN'
        },
        {
          key: 'X-Content-Type-Options',
          value: 'nosniff'
        },
        {
          key: 'Referrer-Policy',
          value: 'origin-when-cross-origin'
        }
      ]
    }
  ]
};
```

### Environment-Specific Settings

**Development:**
```env
NODE_ENV=development
NEXTAUTH_URL=http://localhost:3000
```

**Production:**
```env
NODE_ENV=production
NEXTAUTH_URL=https://your-domain.com
```

## 🚨 Rollback Plan

If issues occur in production:

1. **Immediate Rollback**
   - Go to Vercel Dashboard
   - Find previous working deployment
   - Promote to production

2. **Database Rollback** (if needed)
   ```bash
   npx prisma migrate resolve --rolled-back migration_name
   ```

3. **Notify Users** (if downtime)
   - Status page update
   - Email notification
   - Social media update

## 📞 Support Contacts

- **Hosting**: Vercel support
- **Database**: Neon support
- **Redis**: Upstash support
- **AI**: Anthropic support

## ✅ Post-Launch Tasks

### Week 1
- [ ] Monitor error rates
- [ ] Check performance metrics
- [ ] Review user feedback
- [ ] Fix critical bugs
- [ ] Optimize slow queries

### Month 1
- [ ] Analyze user behavior
- [ ] Optimize conversion funnel
- [ ] Add requested features
- [ ] Improve documentation
- [ ] Scale infrastructure if needed

## 🎯 Success Criteria

- ✅ Zero critical errors in first 24 hours
- ✅ 99%+ uptime in first week
- ✅ <500ms average response time
- ✅ Positive user feedback
- ✅ All core features working

---

**Last Updated**: [Date]
**Deployed By**: [Name]
**Production URL**: [URL]
