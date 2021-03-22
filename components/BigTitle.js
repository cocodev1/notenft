import styles from '../styles/BigTilte.module.css'

export default function BigTilte({children}) {
    return(
        <h1 className={styles.title}>{children}</h1>
    )
}