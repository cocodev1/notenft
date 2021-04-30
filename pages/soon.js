import styles from '../styles/Soon.module.css'
import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import * as yup from "yup"
import Input from '../components/Input'
import BigTitle from '../components/BigTitle'
import {useState} from 'react'

const schema = yup.object().shape({
    email: yup.string().email().required()
})

export default function Soon() {

    const [sent, setSent] = useState(false)

    const { register, handleSubmit, watch, formState: { errors } } = useForm({
        resolver: yupResolver(schema)
    })
    const onSubmit = async data => {

        const res = await fetch('/api/notified', {
            body: JSON.stringify({email: data.email}),
            headers: {
                'Content-Type': 'application/json'
            },
            method: 'POST'
        })
        if(res.ok) setSent(true)

    } 
    return(
        <>
            {!sent && <div className={styles.container}>
                <BigTitle>Comming soon !</BigTitle>
                <form className={styles.formContainer} onSubmit={handleSubmit(onSubmit)}>
                    <Input register={register} name='email' placeholder='Type your email'>Email</Input>
                    <input type='submit' value='Be notified' className={styles.submit}/>
                </form>
                <p className={styles.error}>{errors.email?.message}</p>
            </div>}
            {sent && <div className={styles.container}>
                <BigTitle>Thank you</BigTitle>
                </div>}
        </>
        
    )

}