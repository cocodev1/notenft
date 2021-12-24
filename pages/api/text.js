import connectDB from '../../middleware/mongodb'
import Web3 from 'web3'
import {getInstance} from '../../utils/web3Utils'
import {decrypt} from '../../utils/cryptoUtils'
import {Note} from '../../models/models'
import axios from 'axios'

const handler = async (req, res) => {

    const {signature, signed, address, id, networkVersion} = req.query

    console.log(networkVersion)

    const provider = 
    (networkVersion == 1 && process.env.MAINET_PROVIDER) 
    || (networkVersion == 3 && process.env.ROPSTEN_PROVIDER)
    || (networkVersion == 4 && process.env.RINKEBY_PROVIDER)
    || (networkVersion == 5777 && process.env.LOCAL_PROVIDER)
    || (networkVersion == 80001 && process.env.RINKEBY_MUMBAI_PROVIDER)

    const web3 = new Web3(new Web3.providers.WebsocketProvider(provider))

    const account = web3.eth.accounts.recover(signed, signature)
    if(address == account) {
        const instance = await getInstance(provider)
        const balance = await instance.methods.balanceOf(account, id).call({from: account})
        if(balance != 0) {
            const {IPFSLink, key} = await Note.findOne({id, networkId: networkVersion}).exec()
            const {data} = await axios.get(IPFSLink)
            const text = await decrypt(data, key)
            res.send(text)
        }
    }
}

export default connectDB(handler)