import { api } from '@/utils/api'
import type { AppProps } from 'next/app'

function MyApp({ Component, pageProps }: AppProps) {
  return <Component {...pageProps} />
}

export default api.withTRPC(MyApp);