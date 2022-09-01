import type { NextPage } from 'next'
import Head from 'next/head'
import Image from 'next/image'
import Header from '../components/Header'
import Landing from '../components/Landing'

const Home: NextPage = () => {
  return (
    <div className="">
      <Head>
        <title>Apple Shop</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <Header/>
      <main className='relative h-[200vh] bg-[#E7ECEE]'>
        <Landing/>
      </main>
      <h1>
        
      </h1>
    </div>
  )
}

export default Home
