import connectDB from '../../../middleware/mongodb'
import {Note} from '../../../models/models'
import {encrypt, decrypt} from '../../../utils/cryptoUtils'
import {blur} from '../../../utils/imgUtils'
import axios from 'axios'
import FormData from 'form-data'
import fs from 'fs'

const handler = async (req, res) => {

    const {id} = req.query

    if(req.method == 'POST') {

        const {text, name, description, creator, id, preview, price, copies} = req.body


        const {cipher, key} = await encrypt(text)
        const blurred = await blur(preview)
        let dataPreview = new FormData()
        dataPreview.append('file', blurred, 'file.png')

        var result = await axios.post('https://api.pinata.cloud/pinning/pinFileToIPFS', dataPreview, {
            maxBodyLength: 'Infinity',
            headers: {
                'Content-Type': `multipart/form-data; boundary=${dataPreview._boundary}`,
                pinata_api_key: process.env.PINATA_API_KEY,
                pinata_secret_api_key: process.env.PINATA_API_SECRET,
                ...dataPreview.getHeaders()
            },
            withCredentials: true
        })
        var IpfsPreviewHash = `https://gateway.pinata.cloud/ipfs/${result.data.IpfsHash}`

        const dataCipher = new FormData()
        dataCipher.append('file', cipher, 'file')
        result = await axios.post('https://api.pinata.cloud/pinning/pinFileToIPFS', dataCipher, {
            maxBodyLength: 'Infinity',
            headers: {
                'Content-Type': `multipart/form-data; boundary=${dataCipher._boundary}`,
                pinata_api_key: process.env.PINATA_API_KEY,
                pinata_secret_api_key: process.env.PINATA_API_SECRET
            }
        })
        var IpfsCipherHash = `https://gateway.pinata.cloud/ipfs/${result.data.IpfsHash}`

        const note = new Note({
            id,
            name,
            description,
            IPFSLink: IpfsCipherHash,
            IPFSBlurLink: IpfsPreviewHash,
            key,
            creatorAddress: creator,
            copies
        })

        note.save((err) => {
            console.log(err)
            res.send(err)
        })

        res.send({status: 'ok', data: {id: id}})

    }else {
        const note = await Note.findOne({id}, {key: 0}).exec()
        res.send(note)
    }

}

export default connectDB(handler)