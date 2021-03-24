import Web3 from 'web3'
import Note from '../build/contracts/Note.json'
import {useRouter} from 'next/router'

async function getInstance(network) {

    const networkUrl = //(network == 'local' && process.env.LOCAL_PROVIDER)
    //|| (network == 'mainet' && process.env.MAINET_PROVIDER)
    //|| (network == 'ropsten' && process.env.ROPSTEN_PROVIDER)
    //|| (network == 'rinkeby' && process.env.RINKEBY_PROVIDER)
    /*||*/ network
    || (network == null && null)

    console.log(networkUrl)

    let web3 = networkUrl ? new Web3(
        new Web3.providers.WebsocketProvider(networkUrl)
    ) : new Web3(window.ethereum)
    const networkId = await web3.eth.net.getId()
    const deployedNetwork = Note.networks[networkId]

    const instance = new web3.eth.Contract(Note.abi, deployedNetwork && deployedNetwork.address)
    return instance
}

function getWeb3() {
    if(window.ethereum) return new Web3(window.ethereum)
    else {
        const router = useRouter() 
        router.push('/connect')
    }
}

export {getInstance, getWeb3}