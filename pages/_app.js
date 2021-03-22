import '../styles/globals.css'
import AccountContext from '../contexts/AccountContext'
import FileContext from '../contexts/FileContext'
import Header from '../components/Header'
import {useEffect, useState} from 'react'
import Web3 from 'web3'
import Head from 'next/head'

function MyApp({ Component, pageProps }) {

  const [accounts, setAccounts] = useState(null)
  const [file, setFile] = useState(null)
  
  const [networkVersion, setNetworkVersion] = useState(5777)

  useEffect(async () => {
    if(window.ethereum) {
      const web3 = new Web3(window.ethereum)
      const accs = await web3.eth.getAccounts()
      if(accs.length) setAccounts(accs)
      setNetworkVersion(window.ethereum.networkVersion)
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
        setFile: setFile
      }}>
         <Head>
          <title>NFT Note</title>
          <link rel="icon" href="/notebook.ico" />
        </Head>
        <Header />
        <Component {...pageProps} />
      </FileContext.Provider>  
    </AccountContext.Provider>
  )
}

export default MyApp
