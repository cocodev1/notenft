import '../styles/globals.css'
import AccountContext from '../contexts/AccountContext'
import FileContext from '../contexts/FileContext'
import Header from '../components/Header'
import {useEffect, useState} from 'react'
import Web3 from 'web3'
import Head from 'next/head'

function MyApp({ Component, pageProps }) {

  const [accounts, setAccounts] = useState()
  const [file, setFile] = useState()
  const [extension, setExtension] = useState()
  
  const [networkVersion, setNetworkVersion] = useState(5777)

  useEffect(async () => {
    if(window.ethereum) {
      const web3 = new Web3(window.ethereum)
      const accs = await web3.eth.getAccounts()
      if(accs.length) setAccounts(accs)
      setNetworkVersion(parseInt(window.ethereum.networkVersion))
      ethereum.on('chainChanged', (chainId) => {
        setNetworkVersion(parseInt(chainId))
        console.log(chainId)
      })
    }
  }, [])

  return (
    <AccountContext.Provider value={{
      accounts: accounts,
      setAccounts: setAccounts,
      networkVersion: networkVersion,
      setNetworkVersion: setNetworkVersion
    }}>
      <FileContext.Provider value={{
        file: file,
        setFile: setFile,
        extension: extension,
        setExtension: setExtension
      }}>
         <Head>
         <script async src={`https://www.googletagmanager.com/gtag/js?id=${process.env.NEXT_PUBLIC_GA_ID}`} />
         <script dangerouslySetInnerHTML={{
              __html: `
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', '${process.env.NEXT_PUBLIC_GA_ID}', {
              page_path: window.location.pathname,
            });
          `,
            }}/>
          <title>NFT Note</title>
          <link rel="icon" href="/notebook.ico" />
          <meta name="description" content="Convert file to NFT" />
         </Head>
        {<Header />}
        <Component {...pageProps} />
      </FileContext.Provider>  
    </AccountContext.Provider>
  )
}

export default MyApp
