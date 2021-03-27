import connectDB from "../../../middleware/mongodb"
import {Note} from '../../../models/models'


const handler = async (req, res) => {

const {id} = req.query

const {name, description, creatorAddress, IPFSBlurLink, copies} = await Note.findOne({id}, {key: 0})

res.send({
    name,
    description,
    image: IPFSBlurLink,
    external_link: `https://notenft.com/note/${id}`,
    attributes: [
        {
            trait_type: 'Creator',
            value: creatorAddress
        }
    ],
    background_color: '25292D'
})

}

export default connectDB(handler)