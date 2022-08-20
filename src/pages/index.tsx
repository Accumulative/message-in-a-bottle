import type { NextPage } from 'next';
import dynamic from 'next/dynamic';
import Head from 'next/head';
import { trpc } from '../utils/trpc';

const Main = dynamic(() => import('../components/Main'), { ssr: false });

const Home: NextPage = () => {
  const hello = trpc.useQuery(['example.hello', { text: 'from tRPC' }]);
  return (
    <>
      <Head>
        <title>Message in a bottle</title>
        <meta name="description" content="Message in a bottle" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className="">
        <Main />
      </main>
    </>
  );
};

export default Home;
