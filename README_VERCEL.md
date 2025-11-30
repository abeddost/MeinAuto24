# Vercel Deployment Guide

## 🚀 Quick Deploy

1. **Install Vercel CLI** (if not already installed):
   ```bash
   npm i -g vercel
   ```

2. **Deploy to Vercel**:
   ```bash
   vercel
   ```

3. **For production deployment**:
   ```bash
   vercel --prod
   ```

## 📋 Environment Variables

Set these in your Vercel Dashboard → Settings → Environment Variables:

- `RESEND_API_KEY` - Your Resend API key
- `RESEND_FROM_EMAIL` - Sender email (e.g., meinautopreis24@resend.dev)
- `RESEND_TO_EMAIL` - Admin email (e.g., hfautohaus@gmail.com)
- `NODE_ENV` - Set to `production`

## ⚠️ Important Notes

### File Uploads
- Uploaded images are stored in `/tmp` directory (ephemeral)
- Files are processed and sent via email, then automatically cleaned up
- For persistent storage, consider using Vercel Blob Storage or AWS S3

### Static Files
- Static files in `public/` are automatically served by Vercel
- No additional configuration needed

### API Routes
- All API routes are under `/api/*`
- Serverless functions are in `api/index.js`

## 🔧 Local Development

For local development, continue using:
```bash
npm run dev
```

This uses the regular Express server with persistent file storage.

## 📁 Project Structure

```
├── api/
│   └── index.js          # Vercel serverless function
├── public/               # Static files (auto-served)
├── routes/               # API routes
├── controllers/          # Business logic
├── middleware/           # Upload middleware
├── utils/                # Email service
├── server.js             # Local dev server
└── vercel.json           # Vercel configuration
```

## 🌐 Custom Domain

After deployment, you can add a custom domain in Vercel Dashboard → Settings → Domains.



