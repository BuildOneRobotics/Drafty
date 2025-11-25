# Deployment Guide - Drafty on Vercel

## Prerequisites

- GitHub account with the Drafty repository
- Vercel account (free tier available)
- BuildOne OAuth credentials

## Step 1: Prepare GitHub Repository

```bash
git add .
git commit -m "Initial Drafty setup"
git push origin main
```

## Step 2: Create Vercel Project

1. Go to [vercel.com](https://vercel.com)
2. Click "New Project"
3. Import your GitHub repository
4. Select the Drafty repository

## Step 3: Configure Environment Variables

In Vercel dashboard, add these environment variables:

```
NEXT_PUBLIC_BUILDONE_API_URL=https://api.buildone.com
NEXT_PUBLIC_BUILDONE_CLIENT_ID=<your_buildone_client_id>
BUILDONE_CLIENT_SECRET=<your_buildone_client_secret>
NEXT_PUBLIC_API_URL=https://your-drafty-domain.vercel.app
JWT_SECRET=<generate_a_random_secret>
DATABASE_URL=<optional_database_url>
```

## Step 4: Deploy

1. Click "Deploy"
2. Wait for build to complete
3. Your site will be live at `https://your-project.vercel.app`

## Step 5: Configure BuildOne OAuth

1. Go to BuildOne admin dashboard
2. Add redirect URI: `https://your-drafty-domain.vercel.app/api/auth/buildone/callback`
3. Update `NEXT_PUBLIC_BUILDONE_CLIENT_ID` and `BUILDONE_CLIENT_SECRET` in Vercel

## Production Checklist

- [ ] Environment variables configured
- [ ] BuildOne OAuth credentials set
- [ ] Custom domain configured (optional)
- [ ] SSL certificate enabled
- [ ] Database connected (if using persistent storage)
- [ ] Monitoring enabled

## Monitoring & Logs

Access logs in Vercel dashboard:
- Deployments tab - view build logs
- Functions tab - view API route logs
- Analytics tab - view performance metrics

## Rollback

To rollback to a previous deployment:
1. Go to Deployments tab
2. Find the previous deployment
3. Click the three dots menu
4. Select "Promote to Production"

## Custom Domain

1. In Vercel project settings
2. Go to Domains
3. Add your custom domain
4. Update DNS records as instructed
5. Wait for SSL certificate (usually 5-10 minutes)

## Database Setup (Optional)

For persistent storage, connect a database:

1. PostgreSQL (recommended):
   - Use Vercel Postgres or external provider
   - Update `DATABASE_URL` in environment variables

2. MongoDB:
   - Use MongoDB Atlas
   - Update connection string

## Troubleshooting

### Build fails
- Check Node.js version compatibility
- Verify all dependencies in package.json
- Check environment variables

### OAuth not working
- Verify redirect URI matches exactly
- Check client ID and secret
- Ensure BuildOne API is accessible

### Notes not syncing
- Check API routes are deployed
- Verify authentication tokens
- Check browser console for errors

## Support

For issues, check:
- Vercel documentation: https://vercel.com/docs
- Next.js documentation: https://nextjs.org/docs
- BuildOne documentation: https://buildone.com/docs
