# ✅ Vercel Deployment Checklist

## Pre-Deployment

- [x] ✅ Created `api/index.js` - Serverless function entry point
- [x] ✅ Created `vercel.json` - Vercel configuration
- [x] ✅ Updated `middleware/upload.js` - Uses `/tmp` on Vercel
- [x] ✅ Updated `package.json` - Added `vercel-build` script
- [x] ✅ Removed hardcoded API keys from code
- [x] ✅ Created `.vercelignore` file

## Environment Variables Setup

**Go to Vercel Dashboard → Your Project → Settings → Environment Variables**

Add these variables:

1. **RESEND_API_KEY**
   - Value: `re_HmozmUBv_6t2KyhGQfzoYcKuoPEBeQuKn`
   - Environment: Production, Preview, Development

2. **RESEND_FROM_EMAIL** (optional, if you use it)
   - Value: `meinautopreis24@resend.dev`
   - Environment: Production, Preview, Development

3. **RESEND_TO_EMAIL** (optional, if you use it)
   - Value: `hfautohaus@gmail.com`
   - Environment: Production, Preview, Development

4. **NODE_ENV**
   - Value: `production`
   - Environment: Production only

## Deployment Steps

### Option 1: Via Vercel Dashboard (Recommended)

1. Go to [vercel.com](https://vercel.com)
2. Click "Add New Project"
3. Import your Git repository
4. Vercel will auto-detect settings
5. Add environment variables (see above)
6. Click "Deploy"

### Option 2: Via Vercel CLI

```bash
# Install Vercel CLI (if not installed)
npm i -g vercel

# Login to Vercel
vercel login

# Deploy (first time - will ask questions)
vercel

# Deploy to production
vercel --prod
```

## Post-Deployment

- [ ] Test the homepage loads correctly
- [ ] Test form submission works
- [ ] Test image upload and compression
- [ ] Verify emails are being sent
- [ ] Check email attachments are working
- [ ] Test `/impressum` page
- [ ] Test `/datenschutz` page

## Important Notes

### File Storage
- ⚠️ Uploaded files are stored in `/tmp` (ephemeral)
- Files are automatically deleted after function execution
- Files are sent via email before deletion
- For persistent storage, consider Vercel Blob Storage

### API Routes
- All API routes are under `/api/*`
- Example: `https://your-domain.vercel.app/api/submit-offer`

### Static Files
- Files in `public/` are automatically served
- No additional configuration needed

## Troubleshooting

### If deployment fails:
1. Check Vercel build logs
2. Verify all environment variables are set
3. Check `vercel.json` syntax
4. Ensure `api/index.js` exports correctly

### If emails don't work:
1. Verify `RESEND_API_KEY` is set correctly
2. Check Vercel function logs
3. Verify Resend API key is active

### If file uploads fail:
1. Check `/tmp` directory permissions (should work automatically)
2. Verify file size limits (5MB per file)
3. Check Vercel function logs for errors

## Custom Domain

After deployment:
1. Go to Vercel Dashboard → Settings → Domains
2. Add your custom domain
3. Follow DNS configuration instructions



