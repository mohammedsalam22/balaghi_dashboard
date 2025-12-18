import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import basicSsl from '@vitejs/plugin-basic-ssl'

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')
  const apiBaseUrl = env.VITE_API_BASE_URL
  const apiProxyTargetFromEnv = env.VITE_API_PROXY_TARGET

  let proxyTarget = apiProxyTargetFromEnv
  if (!proxyTarget && apiBaseUrl && /^https?:\/\//i.test(apiBaseUrl)) {
    try {
      proxyTarget = new URL(apiBaseUrl).origin
    } catch {
      // ignore
    }
  }

  // Fallback for local dev if env isn't set
  proxyTarget = proxyTarget || 'http://localhost:5000'

  return {
    plugins: [react(), basicSsl()],
    server: {
      // `rolldown-vite` types require HTTPS options object (not boolean)
      https: {},
      // Avoid CORS/mixed-content by proxying API through Vite
      proxy: {
        '/api': {
          target: proxyTarget,
          changeOrigin: true,
          secure: false,
        },
      },
    },
  }
})
