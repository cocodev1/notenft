import BigTilte from '../components/BigTitle'
import Button from '../components/Button'
import AccountContext from '../contexts/AccountContext'
import { useContext, useEffect, useState } from 'react'
import Image from 'next/image'
import styles from '../styles/Connect.module.css'
import {useRouter} from 'next/router'

export default function Connect() {

    const [isWindow, setIsWindow] = useState(false)

    useEffect(() => {
        const run = async () => {
            if(window) { 
                setIsWindow(true)
                await getAccounts()
            }
        }
        run()
    }, [])

    const {accounts, setAccounts} = useContext(AccountContext)

    async function getAccounts() {
        const accounts = await ethereum.request({ method: 'eth_requestAccounts' })
        setAccounts(accounts)
        router.back()
    }

    const router = useRouter()

    return (
        <div>
            {isWindow && window.ethereum && 
            <div className={styles.container}>
                <p className={styles.title}>Connect your wallet</p>
                <Image src='/Metamask.png' width={300} height={300} layout='fixed'/>
                <button className={styles.button} onClick={getAccounts}>Connect</button>
            </div>}
            {isWindow && !window.ethereum && <BigTilte>You don't have metamask</BigTilte>}
        </div>
    )
}