# 🚀 Bloomroom Deployment Guide

## Quick Deploy to Vercel (Recommended - Free HTTPS)

### Prerequisites
- GitHub account
- Vercel account (free at vercel.com)

### Option 1: Deploy via Vercel Dashboard (Easiest)
1. Go to [vercel.com](https://vercel.com)
2. Click "Add New Project"
3. Import your GitHub repository: `shauryasingh2093/Bloomroom`
4. Click "Deploy"
5. ✅ Done! Your app will be live with HTTPS at `your-app.vercel.app`

### Option 2: Deploy via CLI
```bash
# Install Vercel CLI globally
npm install -g vercel

# Navigate to your project
cd /Users/shauryasingh/Downloads/projects/Bloomroom

# Login to Vercel
vercel login

# Deploy
vercel

# Follow the prompts:
# - Link to existing project or create new
# - Confirm settings
# - Deploy!

# For production deployment
vercel --prod
```

### Auto-Deploy on Git Push
Once linked to Vercel:
- Every `git push` to `main` branch = automatic deployment
- Preview deployments for pull requests
- Rollback to previous versions anytime

---

## 🔒 Security Features (Automatic with Vercel)

✅ **HTTPS/SSL** - Automatic SSL certificate  
✅ **Custom Domain** - Free (optional)  
✅ **DDoS Protection** - Built-in  
✅ **Edge Network** - Global CDN  

---

## 📱 Mobile Testing Checklist

### Before Deploying
Test locally on mobile viewport:
```bash
# Run dev server with network access
npm run dev -- --host

# Access from phone on same WiFi:
# http://YOUR_LOCAL_IP:5178
```

### After Deploying
Test on real devices:
- [ ] iPhone (Safari) - Portrait & Landscape
- [ ] Android (Chrome) - Portrait & Landscape
- [ ] iPad/Tablet
- [ ] Different screen sizes (320px, 375px, 414px, 768px)

### What to Test
- [ ] Main Hall room grid is clickable
- [ ] Mood selector buttons are visible and tappable
- [ ] Profile switcher works
- [ ] All rooms load correctly
- [ ] Forms are usable (Goal creation, Mind Dump, etc.)
- [ ] Buttons are min 44px (touch-friendly)
- [ ] Text is readable
- [ ] No horizontal scrolling
- [ ] Modals fit on screen

---

## 🛠️ Troubleshooting

### "Not a Secure Network" Error
**Cause:** Site is on HTTP instead of HTTPS  
**Solution:** Deploy to Vercel/Netlify (automatic HTTPS)

### Mixed Content Warning
**Cause:** Loading HTTP resources on HTTPS page  
**Check:** Browser console for warnings  
**Fix:** All resources use relative paths (already done ✅)

### Mobile Layout Issues
**Check:** 
- Responsive classes (sm:, md:, lg:)
- Touch target sizes (min 44px)
- Viewport meta tag in index.html

### Deployment Fails
**Common fixes:**
- Run `npm install` to ensure dependencies are up to date
- Check `package.json` for build script
- Verify `vercel.json` configuration

---

## 📊 Performance Optimization (Optional)

### Image Optimization
```bash
# Install Sharp for image optimization
npm install sharp

# Vercel will auto-optimize images
```

### Build Optimization
Already configured in `vite.config.js`:
- Code splitting ✅
- Tree shaking ✅
- Minification ✅

---

## 🔗 Useful Links

- **Vercel Dashboard:** https://vercel.com/dashboard
- **Vercel Docs:** https://vercel.com/docs
- **Your Repo:** https://github.com/shauryasingh2093/Bloomroom

---

## ⚡ Quick Commands Reference

```bash
# Local development
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Deploy to Vercel
vercel

# Deploy to production
vercel --prod

# Check deployment status
vercel ls
```

---

## 📝 Post-Deployment Checklist

- [ ] Test HTTPS is working (lock icon in browser)
- [ ] Test on mobile devices
- [ ] Share link with friends/family for testing
- [ ] Set up custom domain (optional)
- [ ] Enable analytics (optional - Vercel Analytics)
- [ ] Set up environment variables if needed

---

**🎉 Your Bloomroom is ready to bloom online!**
