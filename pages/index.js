import Head from 'next/head'
import styles from '../styles/Home.module.css'
import Link from 'next/link'
//import NoteContract from '../contracts/Note.json'

export default function Home() {
  return (
    <div className={styles.container}>
      <main className={styles.main}>
        <h1 className={styles.welcomeTitle}>Buy and sell files <br /> as NFTs</h1>
        <h2 className={styles.welcomeDescription}>Tokenize your files on the Blockchain <br/> and sell it to OpenSea and Rarible</h2>
        <div className={styles.welcomeButtons}>
          <Link href='/upload'>
            <button className={styles.welcomeButton}>Upload</button>
          </Link>
          <Link href='/soon'>
            <button className={styles.marketButton + ' ' + styles.welcomeButton}>Market</button>
          </Link>
        </div>
      </main>
    </div>
  )
}
