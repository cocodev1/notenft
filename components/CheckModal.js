import Modal from 'react-modal'
import styles from '../styles/CheckModal.module.css'
import CheckLogo from './CheckLogo'

Modal.setAppElement('#__next')

export default function CheckModal({isOpen, isMined, isUploaded}) {
    return (
        <Modal
        {...{isOpen}}
        className={styles.modal}
        overlayClassName={styles.overlay}>
            <div className={styles.content}>
                <div className={styles.check}>
                    <div className={[styles.logo, !isMined ? styles.loading : undefined].join(' ')}>
                        <CheckLogo />
                    </div>
                    <p>Transaction mined</p>
                </div>
                <div className={styles.check}>
                    <div className={[styles.logo, !isUploaded ? styles.loading : undefined].join(' ')}>
                        <CheckLogo />
                    </div>
                    <p>File Uploaded</p>
                </div>
                <div className={styles.check}>
                    <div className={[styles.logo, styles.loading].join(' ')}>
                        <CheckLogo />
                    </div>
                    <p>Redirect</p>
                </div>
            </div>
        </Modal>
    )
}