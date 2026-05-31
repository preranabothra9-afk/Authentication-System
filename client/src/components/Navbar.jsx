import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function Navbar() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  const handleLogout = async () => {
    await logout()
    navigate('/login')
  }

  return (
    <nav className="navbar">
      <Link to="/" className="nav-logo">AuthSystem</Link>
      <div className="nav-links">
        {user ? (
          <>
            <span className="nav-user">{user.name}</span>
            <button onClick={handleLogout} className="btn-nav">Logout</button>
          </>
        ) : (
          <>
            <Link to="/login" className="btn-nav">Login</Link>
            <Link to="/register" className="btn-nav btn-primary">Register</Link>
          </>
        )}
      </div>
    </nav>
  )
}
