import { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import api, { TOKEN_REFRESH_EVENT } from '../api/axios'

export default function Dashboard() {
  const { user, loading } = useAuth()
  const navigate = useNavigate()
  const [refreshCount, setRefreshCount] = useState(0)
  const [ttl, setTtl] = useState(60)
  const [lastRefresh, setLastRefresh] = useState(null)
  const intervalRef = useRef(null)

  useEffect(() => {
    if (!loading && !user) navigate('/login')
  }, [user, loading, navigate])

  useEffect(() => {
    if (!user) return
    const handler = () => {
      setRefreshCount((c) => c + 1)
      setTtl(60)
      setLastRefresh(new Date().toLocaleTimeString())
    }
    window.addEventListener(TOKEN_REFRESH_EVENT, handler)
    return () => window.removeEventListener(TOKEN_REFRESH_EVENT, handler)
  }, [user])

  useEffect(() => {
    if (!user) return
    intervalRef.current = setInterval(() => {
      setTtl((prev) => Math.max(0, prev - 1))
    }, 1000)
    return () => clearInterval(intervalRef.current)
  }, [user])

  useEffect(() => {
    if (!user) return
    const id = setInterval(() => {
      api.get('/profile').catch(() => {})
    }, 20000)
    return () => clearInterval(id)
  }, [user])

  if (loading) return <div className="page-center"><div className="spinner" /></div>
  if (!user) return null

  const tokenStatus = ttl <= 10 ? 'expiring' : 'active'

  return (
    <div className="page-center">
      <div className="card dashboard-card">
        <div className="avatar">{user.name.charAt(0).toUpperCase()}</div>
        <h2>Welcome, {user.name}!</h2>
        <div className="info-grid">
          <div className="info-item">
            <span className="info-label">Email</span>
            <span className="info-value">{user.email}</span>
          </div>
          <div className="info-item">
            <span className="info-label">Role</span>
            <span className="info-value"><span className="badge">{user.role}</span></span>
          </div>
          <div className="info-item">
            <span className="info-label">User ID</span>
            <span className="info-value id">{user._id}</span>
          </div>
          <div className="info-item">
            <span className="info-label">Joined</span>
            <span className="info-value">{new Date(user.createdAt).toLocaleDateString()}</span>
          </div>
          <div className="info-divider" />
          <div className="info-item">
            <span className="info-label">Access Token</span>
            <span className={`info-value token-status ${tokenStatus}`}>
              {ttl}s
            </span>
          </div>
          <div className="info-item">
            <span className="info-label">Refresh Events</span>
            <span className="info-value">{refreshCount}</span>
          </div>
          {lastRefresh && (
            <div className="info-item">
              <span className="info-label">Last Refresh</span>
              <span className="info-value">{lastRefresh}</span>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
