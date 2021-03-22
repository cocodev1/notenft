const crypto = require('crypto')
const CryptoJS = require('crypto-js')
import streamifier from 'streamifier'

async function encrypt(text) {

    const key = crypto.randomBytes(64).toString('hex')

    const cipher  = CryptoJS.AES.encrypt(text, key).toString()

    const readable = streamifier.createReadStream(cipher)

    return {cipher: readable, key: key}
}

async function decrypt(cipher, key) {
  const text = CryptoJS.AES.decrypt(cipher, key).toString(CryptoJS.enc.Utf8)
  console.log({text})
  return text
}

export {encrypt, decrypt}