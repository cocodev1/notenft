import {useRouter} from 'next/router'
import {Note, Account} from '../../models/models'

export default function Account() {

    const router = useRouter()
    const {address} = router.query
    console.log(router)


    return (
      <h1>{address}</h1>
    )
}

export async function getServerSideProps(context) {

    const {address} = context.params
    const {notes} = await Note.find({creatorAddress: address}).exec()
    console.log(notes)

    return {
      props: {notes}, // will be passed to the page component as props
    }
  }