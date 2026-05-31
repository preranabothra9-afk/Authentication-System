import axios from 'axios'

const api = axios.create({
  baseURL: '/api/auth',
  withCredentials: true,
  headers: { 'Content-Type': 'application/json' },
})

const TOKEN_REFRESH_EVENT = 'token-refreshed'

api.interceptors.response.use(
  (res) => res,
  async (error) => {
    const original = error.config
    const msg = error.response?.data?.message

    if (
      error.response?.status === 401 &&
      !original._retry &&
      msg !== 'Access Token Missing' &&
      !original.url.includes('/refresh')
    ) {
      original._retry = true
      try {
        await api.post('/refresh')
        window.dispatchEvent(new CustomEvent(TOKEN_REFRESH_EVENT))
        return api(original)
      } catch {
        window.location.href = '/login'
        return Promise.reject(error)
      }
    }
    return Promise.reject(error)
  }
)

export { TOKEN_REFRESH_EVENT }

export default api
