import Link from 'next/link'
import { useContext, useEffect } from 'react'
import AccountContext from '../contexts/AccountContext'
import styles from '../styles/Header.module.css'
import getAccounts from '../utils/getAccounts'

export default function Header() {

    const {accounts, setAccounts} = useContext(AccountContext)

    async function onClick() {
        console.log(window.ethereum.isConnected())
        const accounts = await getAccounts()
        setAccounts(accounts)
    }
    return (
        <header className={styles.header}>
            {accounts ? 
            <Link href={`/creator/${accounts[0]}`}>
                <p className={styles.headerButton}>My note</p> 
            </Link>
                : 
            <p className={styles.headerButton} onClick={onClick}>Connect Wallet</p>
            }
        </header>
    )
    
}