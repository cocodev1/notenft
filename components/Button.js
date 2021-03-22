import styles from '../styles/Button.module.css'

export default function Button({onClick, children, classNames}) {
    return (
        <button className={[...classNames || '', styles.button].join(' ')} onClick={onClick}>{children}</button>
    )
}