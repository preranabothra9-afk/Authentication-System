import { useState, useEffect, useCallback } from 'react'
import { TOKEN_REFRESH_EVENT } from '../api/axios'

export default function Toast() {
  const [toasts, setToasts] = useState([])

  const addToast = useCallback((msg) => {
    const id = Date.now()
    setToasts((prev) => [...prev, { id, msg }])
    setTimeout(() => setToasts((prev) => prev.filter((t) => t.id !== id)), 4000)
  }, [])

  useEffect(() => {
    const handler = () => addToast('Access token refreshed')
    window.addEventListener(TOKEN_REFRESH_EVENT, handler)
    return () => window.removeEventListener(TOKEN_REFRESH_EVENT, handler)
  }, [addToast])

  if (toasts.length === 0) return null

  return (
    <div className="toast-container">
      {toasts.map((t) => (
        <div key={t.id} className="toast">{t.msg}</div>
      ))}
    </div>
  )
}
