import {useRouter} from 'next/router'
import axios from 'axios'
import {getInstance, getWeb3, getContractAdress} from '../../utils/web3Utils'
import AccountContext from '../../contexts/AccountContext'
import { useContext, useEffect, useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import styles from '../../styles/Note.module.css'
import dayjs from 'dayjs'
import UnlockLogo from '../../components/UnlockLogo'
import {Note} from '../../models/models'
import mongoose from 'mongoose'
import Web3 from 'web3'
import { OpenSeaPort, Network } from 'opensea-js'
import { OrderSide } from 'opensea-js/lib/types'

export default function NotePage({name, description, IPFSBlurLink, creatorAddress, time, price, copies}) {

    const {accounts, networkVersion} = useContext(AccountContext)
    const [localPrice, setLocalPrice] = useState(price)

    const router = useRouter()
    const {id} = router.query

    const [isOwner, setIsOwner] = useState(false)
    const [text, setText] = useState(null)
    const [loading, setLoading] = useState(false)

    useEffect(async () => {
        if(accounts && accounts.length) {
            const instance = await getInstance()
            const balance = await instance.methods.balanceOf(accounts[0], id).call({from: accounts[0]})
            const uri = await instance.methods.uri(1).call()
            if(balance != 0) {
                setIsOwner(true)
            }
        }
    }, [accounts])

    useEffect(async () => {
        try {
        const web3 = new Web3(window.ethereum)
        const seaport = new OpenSeaPort(web3.currentProvider, {
        networkName: (networkVersion == 1 && Network.Main) || (networkVersion == 4 && Network.Rinkeby)})
        const { orders, count } = await seaport.api.getOrders({
            asset_contract_address: getContractAdress(networkVersion),
            token_id: id,
            side: OrderSide.Sell
          })
        const numberWei = orders[orders.length-1].currentPrice.toNumber()
        setLocalPrice(Web3.utils.fromWei(numberWei.toString(), 'ether'))
        } catch (err) {console.log(err)}
    }, [])

    function unlock() {
        setLoading(true)
        const web3 = getWeb3()
        const toSign = {time: Date.now(), id: id, random: Math.random().toString(36)}
        const hash = web3.utils.sha3(JSON.stringify(toSign))
        web3.eth.personal.sign(hash, accounts[0], async (err, signature) => {
            err && console.log(err)
            const {data} = await axios.get('/api/text', {params: {signature, signed: hash, address: accounts[0], id, networkVersion}})
            console.log(data)
            setText(data)
            setLoading(false)
        })
    }

    return (
        <div className={styles.note}>
            {!text && <div className={styles.preview}>
                <Image src={IPFSBlurLink} layout='fill' objectFit='cover' quality={100}/>
                {!loading && <div className={styles.unlock}>
                    <UnlockLogo fill='#FFEBEC'/>
                    {!isOwner && <p className={styles.unlockText}>Buy to unlock</p>}
                </div>}
                {loading && 
                    <div className={styles.spinContainer}>
                        <div className={styles.spin}></div>
                    </div>
                }
                {isOwner && 
                    <div className={styles.unlockContainer}>
                        {!loading && <button className={styles.unlockButton} onClick={unlock}>Unlock</button>}
                    </div>
                }
            </div>}
            {text && 
            <div className={[styles.preview, styles.md].join(' ')}>
                <div dangerouslySetInnerHTML={{__html: text}}></div>
            </div>}
            <div className={styles.container}>
                <div className={styles.info}>
                    <h1 className={styles.name}>{name}</h1>
                    <p className={styles.description}>{description}</p>
                    <div className={styles.generalInfo}>
                        <Link href={`/creator/${creatorAddress}`}>
                            <h4 className={styles.creatorAddress}>{creatorAddress}</h4>
                        </Link>
                        <p className={styles.time}>{dayjs(time).format('DD/MM/YYYY')}</p>
                    </div>
                    <div className={styles.businessInfo}>
                        <p className={styles.copies}>{copies} copies</p>
                        <p className={styles.price}>{localPrice || 'Out'}</p>
                    </div>
                    <div className={styles.buttons}>
                        <Link href={`https://testnets.opensea.io/assets/${getContractAdress(networkVersion)}/${id}`}
                            passHref={true}>
                            <button className={`${styles.button} ${styles.opensea}`}>Opensea</button>
                        </Link>
                        {<Link href={`https://rarible.com/token/${getContractAdress(networkVersion)}:${id}`}
                        passHref={true}>
                            <button className={`${styles.button} ${styles.rarible}`}>Rarible</button>
                        </Link>}
                    </div>
                </div>
            </div>
        </div>
    )

}

export async function getServerSideProps(context) {

    const {id, networdId} = context.query

    async function activateDB() {

        if(mongoose.connection.readyState >= 1) return
        
        mongoose.connect(`mongodb+srv://noteUser:${process.env.DB_PASS}@cluster0.bjqy0.mongodb.net/note?retryWrites=true&w=majority`, {useNewUrlParser: true, useUnifiedTopology: true})
  
        const db = mongoose.connection
        db.on('error', console.error.bind(console, 'connection error:'))
        db.once('open', function() {
          return
        })
      }
    await activateDB()

    var note = await Note.findOne({id, networdId}, {key: 0}).exec()
    note = JSON.parse(JSON.stringify(note))
    const {name, description, IPFSBlurLink, creatorAddress, time, copies} = note

    return {
      props: {name, description, IPFSBlurLink, creatorAddress, time, copies}, // will be passed to the page component as props
    }
  }