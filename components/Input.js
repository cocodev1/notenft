import styles from '../styles/Input.module.css'

export default function Input({register, name, children, placeholder, area, button, loading}) {
    return(
        <div className={styles.container}>
            {!button && <label for={name} className={styles.label}>{children}</label>}
            {!button && (area ? <textarea rows={5} name={name} ref={register} placeholder={placeholder} className={styles.input}></textarea> : 
            <input type='text' ref={register} name={name} placeholder={placeholder} className={styles.input}></input>)}
            {button && (
                <div className={styles.submitContainer}>
                    {!loading && <input type='submit' className={[styles.submit].join(' ')} value={children}/>}
                    {loading && <div className={styles.submit}>
                        <div className={styles.spin}></div>
                    </div>}
                </div>
            )}
        </div>
    )
}