import {useRouter} from 'next/router'

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

    return {
      props: {}, // will be passed to the page component as props
    }
  }