#!/bin/bash

echo "🚀 Building for Netlify deployment..."
echo ""

# Install dependencies for app2
echo "📦 Installing dependencies for App2..."
cd app2
npm install
if [ $? -ne 0 ]; then
    echo "❌ Failed to install app2 dependencies"
    exit 1
fi
cd ..

# Install dependencies for app1
echo "📦 Installing dependencies for App1..."
cd app1
npm install
if [ $? -ne 0 ]; then
    echo "❌ Failed to install app1 dependencies"
    exit 1
fi
cd ..

# Build app2 first (remote)
echo "🔨 Building App2 (Remote)..."
cd app2
npm run build
if [ $? -ne 0 ]; then
    echo "❌ App2 build failed"
    exit 1
fi
cd ..
echo "✅ App2 build completed"
echo ""

# Build app1 (host)
echo "🔨 Building App1 (Host)..."
cd app1
npm run build
if [ $? -ne 0 ]; then
    echo "❌ App1 build failed"
    exit 1
fi
cd ..
echo "✅ App1 build completed"
echo ""

# Copy app2 dist to app1/dist/app2 so both are served together
echo "📁 Copying App2 to App1 dist folder..."
mkdir -p app1/dist/app2
cp -r app2/dist/* app1/dist/app2/
echo "✅ App2 copied to app1/dist/app2"
echo ""

echo "🎉 Build complete!"
echo "📱 App1 (with embedded App2): app1/dist"
echo ""

# Made with Bob
