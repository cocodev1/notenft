import mongoose from 'mongoose'

const NoteSchema = new mongoose.Schema({
    id: Number,
    name: String,
    description: String,
    IPFSLink: String,
    IPFSBlurLink: String,
    key: String,
    creatorAddress: {type: String, lowercase: true},
    time: {type: Date, default: Date.now},
    copies: Number
})

const AccountSchema = new mongoose.Schema({
    name: String,
    address: {type: String, lowercase: true},
    profilePic: String,
    notes: [Number]
})

mongoose.models = {}

const Note = mongoose.model('Note', NoteSchema)
const Account = mongoose.model('Account', AccountSchema)

export {
    Note,
    Account
}