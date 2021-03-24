import {useRouter} from 'next/router'
import {Note, Account} from '../../models/models'
import NoteItem from '../../components/NoteItem'
import styles from '../../styles/Creator.module.css'
import mongoose from 'mongoose'
import Image from 'next/image'
import Chance from 'chance'

export default function AccountPage({notes, profilePic, name}) {

    const router = useRouter()
    const {address} = router.query


    return (
      <div className={styles.container}>
        <div className={styles.info}>
          <div className={[!profilePic && styles.gradiant, styles.profilePicContainer].join(' ')}>
            {profilePic && <Image src={profilePic} width={150} height={150}/>}
          </div>
          <div className={styles.profileInfo}>
            <p className={styles.name}>{name || new Chance().twitter().replace('@', '')}</p>
            <p className={styles.address}>{address}</p>
          </div>
        </div>
        <div className={styles.notes}>
          {notes.map(note => (<NoteItem {...note} noteName={note.name}/>))}
        </div>
      </div>
    )
}

export async function getServerSideProps(context) {

    const {address} = context.params

    async function activateDB() {

      if(mongoose.connection.readyState >= 1) return
      
      mongoose.connect(`mongodb+srv://noteUser:${process.env.DB_PASS}@cluster0.bjqy0.mongodb.net/note?retryWrites=true&w=majority`, {useNewUrlParser: true, useUnifiedTopology: true})

      const db = mongoose.connection;
      db.on('error', console.error.bind(console, 'connection error:'))
      db.once('open', function() {
        return
      })
    }
    await activateDB()

    const notes = await Note.find({creatorAddress: address.toLowerCase()}).exec()
    const account  = await Account.findOne({address: address.toLowerCase()}) || await Account.findOne({name: address}).exec()

    return {
      props: {
        notes: JSON.parse(JSON.stringify(notes)),
        profilePic: account?.profilePic || null, name: account?.name || null
      }, // will be passed to the page component as props
    }
  }