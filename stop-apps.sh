#!/bin/bash

echo "🛑 Stopping Micro Frontend Applications..."

# Kill processes on ports 5173 and 5174
lsof -ti:5173 | xargs kill -9 2>/dev/null
lsof -ti:5174 | xargs kill -9 2>/dev/null

sleep 1

# Verify they're stopped
if lsof -i:5173 > /dev/null 2>&1 || lsof -i:5174 > /dev/null 2>&1; then
    echo "⚠️  Some processes may still be running"
else
    echo "✅ All applications stopped"
fi

# Clean up log files
rm -f app1.log app2.log 2>/dev/null

echo "✨ Done!"

# Made with Bob
