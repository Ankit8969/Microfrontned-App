#!/bin/bash

# Script to build and start both micro frontend apps in preview mode

echo "🚀 Starting Micro Frontend Applications in Preview Mode..."
echo ""

# Check if Node 20+ is available
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed"
    exit 1
fi

# Source nvm if available
if [ -f ~/.nvm/nvm.sh ]; then
    source ~/.nvm/nvm.sh
    nvm use 20 2>/dev/null || nvm use 22 2>/dev/null
fi

NODE_VERSION=$(node -v)
echo "📦 Using Node.js version: $NODE_VERSION"
echo ""

# Kill any existing processes on ports 5173 and 5174
echo "🧹 Cleaning up existing processes..."
lsof -ti:5173 | xargs kill -9 2>/dev/null
lsof -ti:5174 | xargs kill -9 2>/dev/null
sleep 2

# Build App2 (Remote)
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

# Build App1 (Host)
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

# Start App2 preview in background
echo "🔵 Starting App2 (Remote) preview on port 5174..."
cd app2
npm run preview > ../app2-preview.log 2>&1 &
APP2_PID=$!
cd ..

# Wait for App2 to start
echo "⏳ Waiting for App2 to start..."
sleep 5

# Check if App2 is running
if lsof -i:5174 > /dev/null 2>&1; then
    echo "✅ App2 preview is running on http://localhost:5174"
else
    echo "❌ App2 preview failed to start. Check app2-preview.log for errors"
    exit 1
fi

# Start App1 preview in background
echo "🔵 Starting App1 (Host) preview on port 5173..."
cd app1
npm run preview > ../app1-preview.log 2>&1 &
APP1_PID=$!
cd ..

# Wait for App1 to start
echo "⏳ Waiting for App1 to start..."
sleep 5

# Check if App1 is running
if lsof -i:5173 > /dev/null 2>&1; then
    echo "✅ App1 preview is running on http://localhost:5173"
else
    echo "❌ App1 preview failed to start. Check app1-preview.log for errors"
    kill $APP2_PID 2>/dev/null
    exit 1
fi

echo ""
echo "🎉 Both applications are running in preview mode!"
echo ""
echo "📱 App1 (Host):   http://localhost:5173"
echo "📱 App2 (Remote): http://localhost:5174"
echo ""
echo "📝 Logs:"
echo "   App1: tail -f app1-preview.log"
echo "   App2: tail -f app2-preview.log"
echo ""
echo "🛑 To stop both apps, run: ./stop-apps.sh"
echo ""
echo "✨ Now open http://localhost:5173 and click 'App 2 (Remote)' button!"
echo ""

# Keep script running
wait
