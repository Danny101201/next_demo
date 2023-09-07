import { api } from '@/utils/api'
import type { AppProps } from 'next/app'
import "@/styles/globals.css";
import { Provider } from '@/components/Provider';

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <Provider>
      <Component {...pageProps} />
    </Provider>
  )

}

export default api.withTRPC(MyApp);