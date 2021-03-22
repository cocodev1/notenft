import connectDB from '../../../middleware/mongodb'
import {Note} from '../../../models/models'

const handler = async (req, res) => {

    const {address} = req.query

    const notes = await Note.find({creatorAddress: address}, {key: 0}).exec()

    res.send(notes)

}

export default connectDB(handler)