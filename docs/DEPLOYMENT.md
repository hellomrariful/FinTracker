# Fintracker Deployment Guide

## Vercel Deployment

### Prerequisites
- GitHub account with repository containing your Fintracker code
- Vercel account (free tier works)
- MongoDB Atlas account or hosted MongoDB instance
- (Optional) Redis instance for caching
- (Optional) SMTP server for emails

### Step 1: Prepare Your Repository

1. Ensure all code is committed and pushed to GitHub
2. Verify `.env.example` is up to date with all required variables
3. Ensure `package.json` has correct Node version in engines field

### Step 2: Import Project to Vercel

1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Click "New Project"
3. Import your GitHub repository
4. Select the correct framework preset: **Next.js**

### Step 3: Configure Environment Variables

In Vercel Project Settings → Environment Variables, add:

#### Required Variables
```
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/fintracker
JWT_ACCESS_SECRET=[generate with: openssl rand -base64 32]
JWT_REFRESH_SECRET=[generate with: openssl rand -base64 32]
NODE_VERSION=20
```

#### Optional but Recommended
```
# Redis for caching
REDIS_URL=redis://default:password@redis-host:6379

# Email service
EMAIL_FROM=noreply@yourdomain.com
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password

# File storage
BLOB_READ_WRITE_TOKEN=vercel_blob_rw_xxxxxx

# App URL (auto-set by Vercel, but you can override)
NEXT_PUBLIC_APP_URL=https://your-app.vercel.app
```

#### Feature Flags (set to "true" or "false")
```
ENABLE_EMAIL_VERIFICATION=true
ENABLE_RATE_LIMITING=true
ENABLE_FILE_UPLOADS=true
ENABLE_EXPORT_IMPORT=true
ENABLE_NOTIFICATIONS=true
ENABLE_RECURRING_TRANSACTIONS=true
```

### Step 4: Configure Build Settings

Vercel should auto-detect these, but verify:

- **Build Command**: `pnpm run build` or `npm run build`
- **Output Directory**: `.next` (default)
- **Install Command**: `pnpm install` or `npm install`
- **Node.js Version**: 20.x (set via NODE_VERSION env var)

### Step 5: Deploy

1. Click "Deploy"
2. Wait for the build to complete
3. Check build logs for any errors
4. Visit your deployed app at the provided URL

### Step 6: Post-Deployment Setup

1. **Custom Domain** (optional):
   - Go to Project Settings → Domains
   - Add your custom domain
   - Follow DNS configuration instructions

2. **MongoDB Atlas IP Whitelist**:
   - If using MongoDB Atlas, add Vercel's IP addresses
   - Or enable "Allow access from anywhere" (less secure)

3. **Set up Vercel Blob** (for file uploads):
   - Go to Storage tab in Vercel dashboard
   - Create a new Blob store
   - Copy the `BLOB_READ_WRITE_TOKEN`
   - Add it to your environment variables

4. **Configure Cron Jobs** (for scheduled tasks):
   - Edit `vercel.json` to add cron configuration:
   ```json
   {
     "crons": [{
       "path": "/api/cron/daily",
       "schedule": "0 6 * * *"
     }]
   }
   ```

## Troubleshooting

### Build Failures

1. **Node version mismatch**:
   - Ensure `NODE_VERSION=20` is set in environment variables
   - Check `engines` field in package.json

2. **Missing environment variables**:
   - Check build logs for validation errors
   - Ensure all required variables are set
   - Variables must be added before deployment

3. **MongoDB connection issues**:
   - Verify connection string format
   - Check IP whitelist settings
   - Test connection locally first

### Runtime Errors

1. **500 errors on API routes**:
   - Check Function logs in Vercel dashboard
   - Verify MongoDB connection
   - Check JWT secrets are properly set

2. **Authentication issues**:
   - Ensure JWT secrets match between deployments
   - Check cookie settings for production

3. **File upload failures**:
   - Verify BLOB_READ_WRITE_TOKEN is set
   - Check file size limits (default 4.5MB)

## Environment-Specific Settings

### Development
```env
NODE_ENV=development
NEXT_PUBLIC_APP_URL=http://localhost:3000
DEBUG=true
SEED_DATABASE=true
```

### Staging
```env
NODE_ENV=production
NEXT_PUBLIC_APP_URL=https://staging-fintracker.vercel.app
DEBUG=true
SEED_DATABASE=false
```

### Production
```env
NODE_ENV=production
NEXT_PUBLIC_APP_URL=https://fintracker.com
DEBUG=false
SEED_DATABASE=false
```

## Security Checklist

- [ ] All JWT secrets are unique and at least 32 characters
- [ ] MongoDB connection uses SSL/TLS
- [ ] Sensitive environment variables are not logged
- [ ] Rate limiting is enabled for production
- [ ] CORS origins are properly configured
- [ ] File upload size limits are set
- [ ] Email verification is enabled for production

## Monitoring

1. **Vercel Analytics**:
   - Enable in Project Settings → Analytics
   - Monitor performance and errors

2. **Function Logs**:
   - Check logs for API errors
   - Set up log drains for external monitoring

3. **Error Tracking** (optional):
   - Set SENTRY_DSN for error tracking
   - Configure source maps for better debugging

## Backup and Recovery

1. **Database Backups**:
   - Configure MongoDB Atlas automatic backups
   - Or set up manual backup scripts

2. **Environment Variables**:
   - Keep a secure backup of all production env vars
   - Document any changes in version control

## Updates and Maintenance

1. **Zero-downtime deployments**:
   - Vercel handles this automatically
   - New deployments don't affect current users

2. **Rollback**:
   - Use Vercel's instant rollback feature
   - Keep previous deployment URLs for testing

3. **Database Migrations**:
   - Run migrations before deploying breaking changes
   - Test migrations in staging first

## Support

For deployment issues:
1. Check Vercel status page
2. Review build and function logs
3. Test locally with production env vars
4. Contact Vercel support if needed