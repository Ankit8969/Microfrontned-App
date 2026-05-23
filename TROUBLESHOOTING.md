# Troubleshooting Guide

## React Error #306 (Context is undefined)

If you're seeing this error, it's likely due to browser cache serving old JavaScript files.

### Solution 1: Hard Refresh Browser

1. Open http://localhost:5173
2. Press `Cmd+Shift+R` (Mac) or `Ctrl+Shift+R` (Windows/Linux)
3. This forces the browser to reload all files from the server

### Solution 2: Clear Browser Cache

**Chrome/Edge:**
1. Press `F12` to open DevTools
2. Right-click the refresh button
3. Select "Empty Cache and Hard Reload"

**Firefox:**
1. Press `Cmd+Shift+Delete` (Mac) or `Ctrl+Shift+Delete` (Windows)
2. Select "Cached Web Content"
3. Click "Clear Now"

### Solution 3: Rebuild and Restart

```bash
# Stop apps
./stop-apps.sh

# Clean dist folders
rm -rf app1/dist app2/dist

# Rebuild and start
./start-apps.sh
```

### Solution 4: Incognito/Private Window

Open http://localhost:5173 in an incognito/private browser window to bypass cache.

## Current Implementation

The apps now use **Props** for sharing state (NOT Context API):

- **App1** manages the shared state
- **App2** receives state and functions as props
- No Context API = No context errors

## Verify It's Working

1. Open http://localhost:5173
2. Open browser console (F12)
3. You should see NO errors
4. Click "App 1" - see shared data
5. Click buttons - state updates
6. Click "App 2 (Remote)" - see same shared data
7. Click buttons in App2 - state updates in both apps

## If Still Not Working

Check the browser console for the actual error message and verify:

1. Both apps are running (check terminal)
2. You're accessing http://localhost:5173 (not 127.0.0.1)
3. Browser cache is cleared
4. You've done a hard refresh

## Technical Details

### What Changed:

**Before (Context API - Had Errors):**
```javascript
// App1 tried to load SharedContext from App2
const { SharedProvider, useSharedContext } = await import('app2/SharedContext')
// This caused React Context errors
```

**Now (Props - No Errors):**
```javascript
// App1 manages state
const [sharedData, setSharedData] = useState({...})

// App1 passes to App2 as props
<RemoteApp2 
  sharedData={sharedData}
  updateUserName={updateUserName}
  // ... other functions
/>

// App2 receives as props
function App({ sharedData, updateUserName, ... }) {
  // Use the props directly
}
```

This is the standard React pattern and works perfectly with Module Federation!