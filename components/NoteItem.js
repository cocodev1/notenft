import styles from '../styles/NoteItem.module.css'
import Image from 'next/image'
import UnlockLogo from './UnlockLogo'
import dayjs from 'dayjs'
import Link from 'next/link'

export default function NoteItem({IPFSBlurLink, noteName, time, copies, price, id}) {
    return (
        <Link href={`/note/${id}`}>
            <div className={styles.container}>
                <div className={styles.preview}>
                    <Image src={IPFSBlurLink} width={230} height={380}/>
                    <UnlockLogo className={styles.previewLock} width={80} height={100} fill='#FFEBEC'/>
                </div>
                <div className={styles.description}>
                    <div className={[styles.line, styles.bold].join(' ')}>
                        <p className={styles.p}>{noteName}</p>
                        <p className={styles.p}>{price || '2 ETH'}</p>
                    </div>
                    <div className={styles.line}>
                        <p className={styles.p}>{new Intl.NumberFormat( 'en-US', { maximumFractionDigits: 1,notation: "compact" , compactDisplay: "short" }).format(copies)}</p>
                        <p className={styles.p}>{dayjs(time).format('DD/MM/YYYY')}</p>
                    </div>
                </div>
            </div>
        </Link>
        )
}