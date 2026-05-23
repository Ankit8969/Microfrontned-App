# Micro Frontend with Module Federation

🚀 **Live Demo**: [https://microfrontend-ankit.netlify.app/](https://microfrontend-ankit.netlify.app/)

This project demonstrates **Module Federation** using Vite, where **App1** acts as the **Host (Consumer)** and **App2** acts as the **Remote (Producer)**.

## 📚 What is Module Federation?

**Module Federation** is a JavaScript architecture pattern that allows multiple independent applications to share code at runtime. It enables:

- **Code Sharing**: Share components, libraries, and dependencies between applications
- **Independent Deployment**: Each app can be deployed separately
- **Runtime Integration**: Apps load remote modules dynamically at runtime
- **Reduced Bundle Size**: Shared dependencies are loaded once

### Key Concepts

1. **Host (Consumer)**: The main application that consumes remote modules
   - In this project: **App1** (runs on port 5173)
   
2. **Remote (Producer)**: The application that exposes modules for others to consume
   - In this project: **App2** (runs on port 5174)

3. **Exposed Modules**: Components/modules that a remote app makes available
   - App2 exposes: `./App` component

4. **Shared Dependencies**: Libraries shared between apps to avoid duplication
   - Both apps share: `react` and `react-dom`

## 🏗️ Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                         App1 (Host)                         │
│                    http://localhost:5173                    │
│                                                             │
│  ┌──────────────────────────────────────────────────────┐  │
│  │  Local Components                                    │  │
│  │  - Header, Hero, Features                            │  │
│  └──────────────────────────────────────────────────────┘  │
│                           │                                 │
│                           │ Imports at Runtime              │
│                           ▼                                 │
│  ┌──────────────────────────────────────────────────────┐  │
│  │  Remote Component from App2                          │  │
│  │  import('app2/App')                                  │  │
│  └──────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────┘
                            │
                            │ HTTP Request
                            │ GET remoteEntry.js
                            ▼
┌─────────────────────────────────────────────────────────────┐
│                        App2 (Remote)                        │
│                    http://localhost:5174                    │
│                                                             │
│  ┌──────────────────────────────────────────────────────┐  │
│  │  Exposed Modules                                     │  │
│  │  - './App': './src/App.jsx'                          │  │
│  │  - User Cards with API data                          │  │
│  └──────────────────────────────────────────────────────┘  │
│                                                             │
│  ┌──────────────────────────────────────────────────────┐  │
│  │  remoteEntry.js                                      │  │
│  │  (Module Federation manifest)                        │  │
│  └──────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────┘
```

## 🚀 How It Works

### Step 1: App2 Configuration (Remote/Producer)

**File**: `app2/vite.config.js`

```javascript
federation({
  name: 'app2',
  filename: 'remoteEntry.js',
  exposes: {
    './App': './src/App.jsx',  // Expose App component
  },
  shared: ['react', 'react-dom']
})
```

- **name**: Unique identifier for the remote app
- **filename**: Entry file that contains the module federation manifest
- **exposes**: Object mapping of exposed modules
- **shared**: Dependencies shared with the host to avoid duplication

### Step 2: App1 Configuration (Host/Consumer)

**File**: `app1/vite.config.js`

```javascript
federation({
  name: 'app1',
  remotes: {
    app2: 'http://localhost:5174/assets/remoteEntry.js',
  },
  shared: ['react', 'react-dom']
})
```

- **name**: Unique identifier for the host app
- **remotes**: Map of remote apps and their entry points
- **shared**: Same dependencies as remote to ensure compatibility

### Step 3: Consuming Remote Component

**File**: `app1/src/App.jsx`

```javascript
import { lazy, Suspense } from 'react'

// Lazy load remote component
const RemoteApp2 = lazy(() => import('app2/App'))

function App() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <RemoteApp2 />
    </Suspense>
  )
}
```

- **lazy()**: Dynamically imports the remote component
- **Suspense**: Shows fallback UI while loading
- **import('app2/App')**: Fetches the component from App2 at runtime

## 📦 Installation

### Prerequisites
- Node.js v18 or higher
- npm v9 or higher

### Install Dependencies

```bash
# Install dependencies for App1
cd app1
npm install

# Install dependencies for App2
cd ../app2
npm install
```

## 🏃 Running the Applications

**IMPORTANT**: You must run both applications for Module Federation to work!

### Terminal 1 - Start App2 (Remote)
```bash
source ~/.nvm/nvm.sh && nvm use 18
cd app2
npm run dev
```
App2 will run on: http://localhost:5174

### Terminal 2 - Start App1 (Host)
```bash
source ~/.nvm/nvm.sh && nvm use 18
cd app1
npm run dev
```
App1 will run on: http://localhost:5173

### Access the Application
1. Open http://localhost:5173 in your browser
2. Click the "Load Remote App 2" button
3. Watch as App2's component loads dynamically!

## 🎯 Features

### App1 (Host)
- ✅ Header with navigation
- ✅ Hero section with call-to-action
- ✅ Feature cards showcasing React and Vite
- ✅ Button to dynamically load App2 component
- ✅ Suspense with loading state
- ✅ Custom gradient styling

### App2 (Remote)
- ✅ Fetches user data from JSONPlaceholder API
- ✅ Displays user cards in a responsive grid
- ✅ Loading spinner during API fetch
- ✅ Error handling
- ✅ Beautiful card design with avatars
- ✅ Can run standalone or be consumed by App1

## 🔍 Benefits of This Architecture

1. **Independent Development**: Teams can work on App1 and App2 separately
2. **Independent Deployment**: Deploy App2 without touching App1
3. **Code Reusability**: App2's components can be used by multiple hosts
4. **Lazy Loading**: Remote components load only when needed
5. **Shared Dependencies**: React is loaded once, not duplicated
6. **Scalability**: Easy to add more micro frontends

## 🛠️ Build for Production

### Build App2 (Remote)
```bash
cd app2
npm run build
npm run preview  # Preview production build on port 5174
```

### Build App1 (Host)
```bash
cd app1
npm run build
npm run preview  # Preview production build on port 5173
```

## 📝 Key Files

```
MicroFrontend/
├── app1/                          # Host Application
│   ├── src/
│   │   ├── App.jsx               # Imports remote component
│   │   └── App.css               # Custom styling
│   └── vite.config.js            # Federation config (consumer)
│
├── app2/                          # Remote Application
│   ├── src/
│   │   ├── App.jsx               # Exposed component
│   │   └── App.css               # Custom styling
│   └── vite.config.js            # Federation config (producer)
│
└── README.md                      # This file
```

## 🐛 Troubleshooting

### Issue: "Failed to fetch remote entry"
- **Solution**: Make sure App2 is running on port 5174 before loading App1

### Issue: "Shared module is not available"
- **Solution**: Ensure both apps have the same React version in package.json

### Issue: "Module not found: app2/App"
- **Solution**: Check that App2's vite.config.js correctly exposes './App'

### Issue: CORS errors
- **Solution**: Both apps must run on localhost (not 127.0.0.1)

## 📚 Learn More

- [Module Federation Docs](https://module-federation.github.io/)
- [Vite Plugin Federation](https://github.com/originjs/vite-plugin-federation)
- [Micro Frontends](https://micro-frontends.org/)

## 🎉 Summary

This project demonstrates a complete Module Federation setup where:
- **App1** is the host that dynamically loads components from App2
- **App2** is the remote that exposes its components
- Both apps can run independently
- Components are loaded at runtime, not build time
- Shared dependencies prevent code duplication

Happy coding! 🚀