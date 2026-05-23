import { useState, useEffect } from 'react'
import './App.css'

function App({ 
  sharedData = { userName: 'Guest', theme: 'light', counter: 0, notifications: [] },
  updateUserName = () => {},
  toggleTheme = () => {},
  incrementCounter = () => {},
  addNotification = () => {},
  clearNotifications = () => {}
}) {
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    // Fetch users from JSONPlaceholder API
    fetch('https://jsonplaceholder.typicode.com/users')
      .then(response => {
        if (!response.ok) {
          throw new Error('Failed to fetch users')
        }
        return response.json()
      })
      .then(data => {
        setUsers(data)
        setLoading(false)
      })
      .catch(err => {
        setError(err.message)
        setLoading(false)
      })
  }, [])

  return (
    <>
      <main>
        <section className="intro">
          <h2>User Directory - App 2</h2>
          <p>Browse through our collection of users fetched from the API</p>
          
          {/* Display shared data */}
          <div style={{
            background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
            padding: '1.5rem',
            borderRadius: '10px',
            color: 'white',
            marginTop: '1rem',
            marginBottom: '1rem'
          }}>
            <h3 style={{ marginBottom: '1rem' }}>📊 Shared State Data (App 2)</h3>
            <p><strong>User Name:</strong> {sharedData.userName}</p>
            <p><strong>Theme:</strong> {sharedData.theme}</p>
            <p><strong>Counter:</strong> {sharedData.counter}</p>
            <p><strong>Notifications:</strong> {sharedData.notifications.length}</p>
            {sharedData.notifications.length > 0 && (
              <div style={{ marginTop: '1rem' }}>
                <strong>All Notifications:</strong>
                <ul style={{ marginTop: '0.5rem', paddingLeft: '1.5rem' }}>
                  {sharedData.notifications.map(notif => (
                    <li key={notif.id}>{notif.message}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          {/* Buttons to modify shared data */}
          <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', marginBottom: '2rem' }}>
            <button
              onClick={() => updateUserName(prompt('Enter new name:') || sharedData.userName)}
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
              Change User Name
            </button>
            <button
              onClick={() => {
                incrementCounter()
                addNotification(`Counter incremented from App2 to ${sharedData.counter + 1}`)
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
              Increment Counter
            </button>
            <button
              onClick={() => addNotification(`New notification from App2 at ${new Date().toLocaleTimeString()}`)}
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
              Add Notification
            </button>
            <button
              onClick={() => toggleTheme()}
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
              Toggle Theme
            </button>
            <button
              onClick={() => clearNotifications()}
              style={{
                padding: '0.75rem 1.5rem',
                background: '#9c27b0',
                color: 'white',
                border: 'none',
                borderRadius: '5px',
                cursor: 'pointer',
                fontWeight: '600'
              }}
            >
              Clear Notifications
            </button>
          </div>
        </section>

        {loading && (
          <div className="loading">
            <div className="spinner"></div>
            <p>Loading users...</p>
          </div>
        )}

        {error && (
          <div className="error">
            <p>Error: {error}</p>
          </div>
        )}

        {!loading && !error && (
          <section className="cards-container">
            {users.map(user => (
              <div key={user.id} className="card">
                <div className="card-header">
                  <div className="avatar">
                    {user.name.charAt(0).toUpperCase()}
                  </div>
                  <h3>{user.name}</h3>
                </div>
                <div className="card-body">
                  <p><strong>Username:</strong> {user.username}</p>
                  <p><strong>Email:</strong> {user.email}</p>
                  <p><strong>Phone:</strong> {user.phone}</p>
                  <p><strong>Website:</strong> {user.website}</p>
                  <p><strong>Company:</strong> {user.company.name}</p>
                  <p><strong>City:</strong> {user.address.city}</p>
                </div>
              </div>
            ))}
          </section>
        )}
      </main>
    </>
  )
}

export default App

