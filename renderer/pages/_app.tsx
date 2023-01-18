import '../styles/globals.css';
import type { AppProps } from 'next/app';
import Layout from '../components/Layout';

function getLayout(page: JSX.Element) {
  return (
    <Layout>
      {page}
    </Layout>
  )
}

export default function App({ Component, pageProps: { ...pageProps } }: AppProps) {
  return (
    getLayout(<Component {...pageProps} />)
  );
}
