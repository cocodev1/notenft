import {createContext} from 'react'

export default createContext({
    accounts: [],
    setAccounts: () => {},
    networkVersion: 5777,
    setNetworkVersion: () => {}
  })