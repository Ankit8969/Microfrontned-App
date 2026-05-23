# Deployment Guide for Netlify

## ⚠️ Important: Module Federation Limitation

**Module Federation with separate deployments is complex and requires both apps to be accessible at runtime.**

For Netlify deployment, you have two options:

## Option 1: Deploy as Single App (Recommended for Netlify)

Since Module Federation requires both apps to be running simultaneously, the simplest approach for Netlify is to deploy them as a single application.

### Steps:

1. **Update `netlify.toml`** (already configured):
   - Builds both app1 and app2
   - Publishes app1/dist
   - App2 needs to be served from a subdirectory

2. **Modify build to copy app2 to app1**:

Create a new file `build-for-netlify.sh`:

```bash
#!/bin/bash

echo "Building for Netlify deployment..."

# Install dependencies
cd app2 && npm install && cd ..
cd app1 && npm install && cd ..

# Build app2 first
cd app2
npm run build
cd ..

# Build app1
cd app1
npm run build
cd ..

# Copy app2 dist to app1/dist/app2
mkdir -p app1/dist/app2
cp -r app2/dist/* app1/dist/app2/

echo "Build complete! app1/dist contains both apps"
```

3. **Update app1/vite.config.js** to use relative path:

```javascript
remotes: {
  app2: '/app2/assets/remoteEntry.js',
}
```

4. **Update Netlify build command**:

In `netlify.toml`:
```toml
[build]
  command = "chmod +x build-for-netlify.sh && ./build-for-netlify.sh"
  publish = "app1/dist"
```

## Option 2: Deploy to Separate Netlify Sites

If you want to deploy app1 and app2 separately:

### Deploy App2 (Remote):

1. Create a new Netlify site for app2
2. Set build command: `cd app2 && npm install && npm run build`
3. Set publish directory: `app2/dist`
4. Note the deployed URL (e.g., `https://app2.netlify.app`)

### Deploy App1 (Host):

1. Create a new Netlify site for app1
2. Set environment variable:
   - Key: `VITE_APP2_URL`
   - Value: `https://app2.netlify.app` (your app2 URL)
3. Set build command: `cd app1 && npm install && npm run build`
4. Set publish directory: `app1/dist`

### CORS Configuration:

App2 needs to allow CORS from App1's domain. Add to `app2/netlify.toml`:

```toml
[[headers]]
  for = "/*"
  [headers.values]
    Access-Control-Allow-Origin = "https://your-app1-domain.netlify.app"
    Access-Control-Allow-Methods = "GET, OPTIONS"
    Access-Control-Allow-Headers = "*"
```

## Option 3: Use Vercel (Better for Module Federation)

Vercel has better support for monorepos and Module Federation:

1. Connect your GitHub repo to Vercel
2. Vercel will detect both apps
3. Deploy each as a separate project
4. Use environment variables to connect them

## Current Setup (Local Development)

The current `netlify.toml` is configured for Option 1 but needs the build script update.

## Recommended Approach

For production deployment with Module Federation:

1. **Use a monorepo platform** like Vercel or Nx Cloud
2. **Or deploy as a single app** (Option 1 above)
3. **Or use a CDN** to serve both apps from the same domain

## Testing Locally Before Deploy

```bash
# Build both apps
npm run build --prefix app2
npm run build --prefix app1

# Test with a local server
npx serve app1/dist -p 3000
```

Then open http://localhost:3000

## Note

The current configuration in `netlify.toml` will build both apps but only serve app1. You need to implement Option 1 (copy app2 into app1/dist) for it to work properly.