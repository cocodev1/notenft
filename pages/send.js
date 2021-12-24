import AccountContext from '../contexts/AccountContext'
import {useRouter} from 'next/router'
import {useContext, useEffect, useRef, useState} from 'react'
import FileContext from '../contexts/FileContext'
import styles from '../styles/Send.module.css'
import {useScreenshot} from 'use-react-screenshot'
import { useForm } from "react-hook-form"
import { yupResolver } from '@hookform/resolvers/yup'
import * as yup from "yup"
import Input from '../components/Input'
import axios from 'axios'
import {getInstance} from '../utils/web3Utils'
import { OpenSeaPort, Network } from 'opensea-js'
import Web3 from 'web3'
import mammoth from 'mammoth'
import showdown from 'showdown'
import CheckModal from '../components/CheckModal'

export default function send() {

    const router = useRouter()

    const {file, extension} = useContext(FileContext)
    const {accounts, networkVersion} = useContext(AccountContext)

    const [fileContent, setFileContent] = useState('No preview available')
    const [image, takeScreenshot] = useScreenshot()

    const ref = useRef(null)

    const [isOpen, setIsOpen] = useState(false)
    const [isMined, setIsMined] = useState(false)
    const [isUploaded, setIsUploaded] = useState(false)

    useEffect(async () => {
        if(extension == 'md') {
            const content = await readFile(file)
            const converter = new showdown.Converter()
            const value = converter.makeHtml(content)
            setFileContent(value)
        }else if(extension == 'docx' || extension == 'doc') {
            const buff = await file.arrayBuffer()
            const {value} = await mammoth.convertToHtml({arrayBuffer: buff}, {})
            setFileContent(value)
        }
        takeScreenshot(ref.current)
    }, [file])

    const NoteSchema = yup.object().shape({
        name: yup.string().required(),
        description: yup.string().required(),
        copies: yup.number().required().positive().integer(),
        price: yup.number().positive()
    })

    const { register, handleSubmit, watch, errors } = useForm({resolver: yupResolver(NoteSchema)})

    const setPriceOnOpensea = async () => {
        const web3 = new Web3(window.ethereum)
        if(networkVersion == 1 || networkVersion == 3) {
            const provider = web3.currentProvider
            const seaport = new OpenSeaPort(provider, {
            networkName: networkVersion == 1 ? Network.Main : Network.Rinkeby
            })
            const listing = await seaport.createSellOrder({
                asset: {
                tokenId: id,
                tokenAddress: '0xf527031ec152922616ff75edaff3cfbf11e69a6f',
                schemaName: 'ERC1155'
                },
                accountAddress: accounts[0],
                startAmount: price,
                // If `endAmount` is specified, the order will decline in value to that amount until `expirationTime`. Otherwise, it's a fixed-price order:
                expirationTime,
                quantity: copies,
            })
            const expirationTime = Math.round(Date.now() / 1000 + 60 * 60 * 24)
        }
    }
 
    const onSubmit = async (data) => {
        setIsOpen(true)
        setLoading(true)
        takeScreenshot(ref.current)
        const text = fileContent
        const {name, description, copies, price} = data
        const creator = accounts[0]
        const preview = image
        const instance = await getInstance(networkVersion)
        try {
        instance.methods.mint(copies).send({from: accounts[0]})
            .on('receipt', async receipt => {
                setIsMined(true)
                console.log(receipt)
                const id = receipt.events.Mint.returnValues.id
                const res = await axios.post(`/api/note/${id}`, {networkId: networkVersion, text, name, description, creator, id, preview, copies, price})
                setIsUploaded(true)
                if(res.status == 200) {
                    await setPriceOnOpensea()
                    setLoading(false)
                    router.replace(`/note/${id}?networkId=${networkVersion}`)
                }else {
    
                }
            })
        } catch (err) {
            setLoading(false)
            throw err
        }
    }

    const [loading, setLoading] = useState(false)

    return(
        <div className={styles.send}>
            <div ref={ref} className={styles.md}>
                <div dangerouslySetInnerHTML={{__html: fileContent}}></div>
            </div> 
            <div className={styles.container}>
                <form onSubmit={handleSubmit(onSubmit)} className={styles.form}>
                    <Input name='name' placeholder='Type a name' register={register} error={errors.name}>Name</Input>
                    <Input name='description' placeholder='Type a description' register={register} error={errors.description} area={true}>Description</Input>
                    <Input name='copies' placeholder='Type a number' register={register} error={errors.copies}>Number of copies</Input>
                    {(networkVersion == 1 || networkVersion == 4) && <Input name='price' placeholder='Type a number' register={register} error={errors.price}>Price</Input>}
                    <Input button={true} loading={loading}>Mint</Input>
                    <CheckModal {...{isOpen, isMined, isUploaded}}/>
                </form>
            </div>  
        </div>
    )
}

async function readFile(file) {
    const content = await file.text()
    return content
}