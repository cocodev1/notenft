import { useCallback, useContext, useEffect} from 'react'
import styles from '../styles/Upload.module.css'
import {useDropzone} from 'react-dropzone'
import {useRouter} from 'next/router'
import FileContext from '../contexts/FileContext'
import AccountContext from '../contexts/AccountContext'


export default function Upload() {

    const {accounts} = useContext(AccountContext)

    useEffect(() => {
        if(!accounts) {
            router.push('/connect')
        }
    }, [accounts])

    const router = useRouter()

    const {setFile} = useContext(FileContext)

    const {getRootProps, getInputProps, open, acceptedFiles, isDragActive, fileRejections} = useDropzone({
        noClick: true,
        noKeyboard: true,
        multiple: false,
        accept: '.md',
        validator: (file) => {
            if(file.name.slice(-3).toLocaleLowerCase() != '.md') {
                console.log(file.name, file.name.slice(-3))
                return {}
            } 
            return null
        }
      })

    useEffect(() => {
        console.log(acceptedFiles, fileRejections)
        if(acceptedFiles.length) {
            setFile(acceptedFiles[0])
            router.push({
                pathname: '/send',
            })
        }
    }, [acceptedFiles, fileRejections])


    return(
    <div className={styles.main}>
        <div {...getRootProps({className: `${styles.dropZone} ${isDragActive && styles.dropActive}`})}>
            <input {...getInputProps()} />
            <p className={styles.dropText}>Drag and drop <br />your file here <br/> or</p>
            <button className={styles.dropButton} onClick={open}>Choose file</button>
            {fileRejections.length > 0 && <p className={styles.dropError}>Only markdown file are accepted</p>}
        </div>
    </div>
    )
}