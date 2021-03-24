import AccountContext from '../contexts/AccountContext'
import ReactMarkdown from 'react-markdown'
import {useRouter} from 'next/router'
import {useContext, useEffect, useRef, useState} from 'react'
import FileContext from '../contexts/FileContext'
import styles from '../styles/Send.module.css'
import {useScreenshot} from 'use-react-screenshot'
import { useForm } from "react-hook-form"
import Input from '../components/Input'
import axios from 'axios'
import {getInstance} from '../utils/web3Utils'

export default function send() {

    const router = useRouter()

    const {file} = useContext(FileContext)
    const {accounts} = useContext(AccountContext)

    const [fileContent, setFileContent] = useState('')
    const [image, takeScreenshot] = useScreenshot()

    const ref = useRef(null)

    useEffect(async () => {
        const content = await readFile(file)
        setFileContent(content)
        takeScreenshot(ref.current)
    }, [file])

    const { register, handleSubmit, watch, errors } = useForm()

    const onSubmit = async (data) => {
        setLoading(true)
        takeScreenshot(ref.current)
        const text = fileContent
        const {name, description, copies, price} = data
        const creator = accounts[0]
        const preview = image
        const instance = await getInstance()
        instance.once('Mint',{address: accounts[0]}, async (err, event) => {
            const id = event.returnValues.id
            const res = await axios.post(`/api/note/${id}`, {text, name, description, creator, id, preview, copies, price})
            if(res.status == 200) {
                setLoading(false)
                router.replace(`/note/${id}`)
            }else {

            }

        })
        await instance.methods.mint(copies).send({from: accounts[0]})
    }

    const [loading, setLoading] = useState(false)

    return(
        <div className={styles.send}>
            <div ref={ref} className={styles.md}>
                <ReactMarkdown>{fileContent}</ReactMarkdown>
            </div> 
            <div className={styles.container}>
                <form onSubmit={handleSubmit(onSubmit)} className={styles.form}>
                    <Input name='name' placeholder='Type a name' register={register}>Name</Input>
                    <Input name='description' placeholder='Type a description' register={register} area={true}>Description</Input>
                    <Input name='copies' placeholder='Type a number' register={register}>Number of copies</Input>
                    <Input name='price' placeholder='Type a name' register={register}>Price</Input>
                    <Input button={true} loading={loading}>Send to Blockchain</Input>
                </form>
            </div>    
        </div>
    )
}

async function readFile(file) {
    const content = await file.text()
    return content
}