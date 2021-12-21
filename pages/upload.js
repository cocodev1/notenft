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

    const {setFile, setExtension} = useContext(FileContext)

    const {getRootProps, getInputProps, open, acceptedFiles, isDragActive, fileRejections} = useDropzone({
        noClick: true,
        noKeyboard: true,
        multiple: false,
        validator: (file) => {
            var extension = file.name.split('.')
            extension = extension[extension.length-1]
            if(['md, doc, docx'].includes(extension)) {
                console.log(file.name, extension)
                return 
            } 
            return null
        }
      })

    useEffect(() => {
        console.log(acceptedFiles, fileRejections)
        if(acceptedFiles.length) {
            setFile(acceptedFiles[0])
            var extension = acceptedFiles[0].name.split('.')
            extension = extension[extension.length-1]
            setExtension(extension)
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
        </div>
    </div>
    )
}