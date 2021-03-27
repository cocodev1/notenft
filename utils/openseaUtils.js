import Web3 from 'web3'

const web3 = new Web3(window.ethereum)
      const seaport = new OpenSeaPort(web3.currentProvider, {
        networkName: Network.Rinkeby
      })