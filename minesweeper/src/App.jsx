import { useState, useEffect } from 'react'
import Welcome from './components/welcome'
import Minesweeper from './components/minesweeper'
import './App.css'

function App() {
  const [user, setUser] = useState(null)

  useEffect(() => {
    const token = localStorage.getItem('token')
    if (token) {
      // Optionally verify token, but for now assume valid
      setUser({ username: 'user' }) // Placeholder
    }
  }, [])

  const handleLogin = (userData) => {
    setUser(userData)
  }

  const handleLogout = () => {
    localStorage.removeItem('token')
    setUser(null)
  }

  return (
    <div className="App">
      {user ? (
        <div>
          <button onClick={handleLogout}>Logout</button>
          <Minesweeper user={user} />
        </div>
      ) : (
        <Welcome onLogin={handleLogin} />
      )}
    </div>
  )
}

export default App
