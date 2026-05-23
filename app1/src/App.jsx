import { useState, lazy, Suspense, Component } from "react";
import reactLogo from "./assets/react.svg";
import viteLogo from "./assets/vite.svg";
import heroImg from "./assets/hero.png";
import "./App.css";

// Error Boundary Component
class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error("Error loading remote component:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div
          style={{
            padding: "2rem",
            background: "#fee",
            border: "2px solid #fcc",
            borderRadius: "10px",
            margin: "2rem 0",
            textAlign: "center",
          }}
        >
          <h3 style={{ color: "#c33", marginBottom: "1rem" }}>
            ⚠️ Failed to Load Remote Component
          </h3>
          <p style={{ color: "#666", marginBottom: "1rem" }}>
            {this.state.error?.message || "Unknown error occurred"}
          </p>
          <details style={{ textAlign: "left", marginTop: "1rem" }}>
            <summary style={{ cursor: "pointer", color: "#667eea" }}>
              Show Error Details
            </summary>
            <pre
              style={{
                background: "#f5f5f5",
                padding: "1rem",
                borderRadius: "5px",
                overflow: "auto",
                fontSize: "0.85rem",
                marginTop: "0.5rem",
              }}
            >
              {this.state.error?.stack || "No stack trace available"}
            </pre>
          </details>
          <button
            onClick={() => window.location.reload()}
            style={{
              marginTop: "1rem",
              padding: "0.5rem 1.5rem",
              background: "#667eea",
              color: "white",
              border: "none",
              borderRadius: "5px",
              cursor: "pointer",
            }}
          >
            Reload Page
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}

// Lazy load the remote component from app2
const RemoteApp2 = lazy(() =>
  import("app2/App").catch((err) => {
    console.error("Failed to load remote module:", err);
    throw new Error(
      `Cannot load remote module from App2. Make sure App2 is running on http://localhost:5174. Error: ${err.message}`,
    );
  }),
);

const RemoteContext = lazy(() => import("app2/SharedContext").catch((err) => {
  console.error("Failed to load remote context:", err);
  throw new Error(
    `Cannot load remote context from App2. Make sure App2 is running on http://localhost:5174. Error: ${err.message}`,
  );
}));

function App() {
  const [showRemote, setShowRemote] = useState(false);
  console.log(RemoteContext);
  // Shared state managed in App1
  const [sharedData, setSharedData] = useState({
    userName: 'Guest',
    theme: 'light',
    counter: 0,
    notifications: []
  });

  const updateUserName = (name) => {
    setSharedData(prev => ({ ...prev, userName: name }));
  };

  const toggleTheme = () => {
    setSharedData(prev => ({ 
      ...prev, 
      theme: prev.theme === 'light' ? 'dark' : 'light' 
    }));
  };

  const incrementCounter = () => {
    setSharedData(prev => ({ ...prev, counter: prev.counter + 1 }));
  };

  const addNotification = (message) => {
    setSharedData(prev => ({
      ...prev,
      notifications: [...prev.notifications, { id: Date.now(), message }]
    }));
  };

  const clearNotifications = () => {
    setSharedData(prev => ({ ...prev, notifications: [] }));
  };

  return (
    <>
      <header style={{
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        padding: '1.5rem 2rem',
        boxShadow: '0 2px 10px rgba(0, 0, 0, 0.1)',
        marginBottom: '2rem'
      }}>
        <div style={{
          maxWidth: '1200px',
          margin: '0 auto',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          <h1 style={{ color: 'white', fontSize: '1.8rem', fontWeight: '700' }}>
            Micro Frontend App 1 (Host)
          </h1>
          <div style={{ display: 'flex', gap: '1rem' }}>
            <button
              onClick={() => setShowRemote(false)}
              style={{
                padding: '0.75rem 2rem',
                fontSize: '1rem',
                background: !showRemote ? 'rgba(255, 255, 255, 0.3)' : 'rgba(255, 255, 255, 0.1)',
                color: 'white',
                border: '2px solid white',
                borderRadius: '25px',
                cursor: 'pointer',
                fontWeight: '600',
                transition: 'all 0.3s ease',
              }}
              onMouseOver={(e) => e.target.style.background = 'rgba(255, 255, 255, 0.25)'}
              onMouseOut={(e) => e.target.style.background = !showRemote ? 'rgba(255, 255, 255, 0.3)' : 'rgba(255, 255, 255, 0.1)'}
            >
              App 1
            </button>
            <button
              onClick={() => setShowRemote(true)}
              style={{
                padding: '0.75rem 2rem',
                fontSize: '1rem',
                background: showRemote ? 'rgba(255, 255, 255, 0.3)' : 'rgba(255, 255, 255, 0.1)',
                color: 'white',
                border: '2px solid white',
                borderRadius: '25px',
                cursor: 'pointer',
                fontWeight: '600',
                transition: 'all 0.3s ease',
              }}
              onMouseOver={(e) => e.target.style.background = 'rgba(255, 255, 255, 0.25)'}
              onMouseOut={(e) => e.target.style.background = showRemote ? 'rgba(255, 255, 255, 0.3)' : 'rgba(255, 255, 255, 0.1)'}
            >
              App 2 (Remote)
            </button>
          </div>
        </div>
      </header>
      <main>
        {!showRemote ? (
          <>
            <section className="hero">
              <img src={heroImg} alt="Hero" />
              <h2>Welcome to App 1 - Host Application</h2>
              <p>
                This is a micro frontend application built with React and Vite
                using Module Federation with Shared State via Props.
              </p>
              
              {/* Display shared data in App1 */}
              <div style={{
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                padding: '1.5rem',
                borderRadius: '10px',
                color: 'white',
                marginTop: '1.5rem',
                marginBottom: '1rem'
              }}>
                <h3 style={{ marginBottom: '1rem' }}>📊 Shared State Data (App 1)</h3>
                <p><strong>User Name:</strong> {sharedData.userName}</p>
                <p><strong>Theme:</strong> {sharedData.theme}</p>
                <p><strong>Counter:</strong> {sharedData.counter}</p>
                <p><strong>Notifications:</strong> {sharedData.notifications.length}</p>
                {sharedData.notifications.length > 0 && (
                  <div style={{ marginTop: '1rem' }}>
                    <strong>Recent Notifications:</strong>
                    <ul style={{ marginTop: '0.5rem', paddingLeft: '1.5rem' }}>
                      {sharedData.notifications.slice(-3).map(notif => (
                        <li key={notif.id}>{notif.message}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>

              {/* Buttons to modify shared data from App1 */}
              <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', marginBottom: '1rem' }}>
                <button
                  onClick={() => toggleTheme()}
                  style={{
                    padding: '0.75rem 1.5rem',
                    background: '#667eea',
                    color: 'white',
                    border: 'none',
                    borderRadius: '5px',
                    cursor: 'pointer',
                    fontWeight: '600'
                  }}
                >
                  Toggle Theme
                </button>
                <button
                  onClick={() => {
                    incrementCounter();
                    addNotification(`Counter updated from App1: ${sharedData.counter + 1}`);
                  }}
                  style={{
                    padding: '0.75rem 1.5rem',
                    background: '#f5576c',
                    color: 'white',
                    border: 'none',
                    borderRadius: '5px',
                    cursor: 'pointer',
                    fontWeight: '600'
                  }}
                >
                  Increment from App1
                </button>
                <button
                  onClick={() => clearNotifications()}
                  style={{
                    padding: '0.75rem 1.5rem',
                    background: '#ff9800',
                    color: 'white',
                    border: 'none',
                    borderRadius: '5px',
                    cursor: 'pointer',
                    fontWeight: '600'
                  }}
                >
                  Clear Notifications
                </button>
                <button
                  onClick={() => updateUserName(prompt('Enter new name:') || sharedData.userName)}
                  style={{
                    padding: '0.75rem 1.5rem',
                    background: '#4caf50',
                    color: 'white',
                    border: 'none',
                    borderRadius: '5px',
                    cursor: 'pointer',
                    fontWeight: '600'
                  }}
                >
                  Change User Name
                </button>
              </div>

              <button
                onClick={() => setShowRemote(!showRemote)}
                style={{
                  marginTop: "1rem",
                  padding: "0.75rem 2rem",
                  fontSize: "1rem",
                  background:
                    "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                  color: "white",
                  border: "none",
                  borderRadius: "25px",
                  cursor: "pointer",
                  fontWeight: "600",
                  transition: "transform 0.2s",
                }}
                onMouseOver={(e) => (e.target.style.transform = "scale(1.05)")}
                onMouseOut={(e) => (e.target.style.transform = "scale(1)")}
              >
                {showRemote ? "Hide Remote App 2" : "Load Remote App 2"}
              </button>
            </section>

            <section className="features">
              <div className="feature-card">
                <img src={reactLogo} alt="React" />
                <h3>React</h3>
                <p>Built with React for dynamic UI components</p>
              </div>
              <div className="feature-card">
                <img src={viteLogo} alt="Vite" />
                <h3>Vite + Module Federation</h3>
                <p>
                  Powered by Vite with Module Federation for micro frontends
                </p>
              </div>
            </section>
          </>
        ) : (
          <section style={{ marginTop: "3rem" }}>
            <div
              style={{
                padding: "2rem",
                background:
                  "linear-gradient(to right, #f093fb 0%, #f5576c 100%)",
                borderRadius: "15px",
                marginBottom: "2rem",
              }}
            >
              <h2
                style={{
                  color: "white",
                  textAlign: "center",
                  marginBottom: "1rem",
                }}
              >
                🚀 Remote Component from App 2
              </h2>
              <p style={{ color: "white", textAlign: "center" }}>
                This component is loaded dynamically from App 2 using Module
                Federation with shared state via props
              </p>
            </div>
            <ErrorBoundary>
              <Suspense
                fallback={
                  <div style={{ textAlign: "center", padding: "3rem" }}>
                    <div
                      className="spinner"
                      style={{
                        width: "50px",
                        height: "50px",
                        border: "4px solid #f3f3f3",
                        borderTop: "4px solid #667eea",
                        borderRadius: "50%",
                        animation: "spin 1s linear infinite",
                        margin: "0 auto 1rem",
                      }}
                    ></div>
                    <p>Loading Remote App 2...</p>
                  </div>
                }
              >
                <RemoteApp2 
                  sharedData={sharedData}
                  updateUserName={updateUserName}
                  toggleTheme={toggleTheme}
                  incrementCounter={incrementCounter}
                  addNotification={addNotification}
                  clearNotifications={clearNotifications}
                />
              </Suspense>
            </ErrorBoundary>
          </section>
        )}
      </main>

      <footer>
        <p>&copy; 2026 Micro Frontend App. All rights reserved.</p>
      </footer>
    </>
  );
}

export default App;

// Made with Bob
