import jimp from 'jimp'
import {Readable} from 'stream'
import streamifier from 'streamifier'

async function blur(base64url) {
    base64url = base64url.replace(/^data:image\/png;base64,/, '')
    base64url = base64url.split(' ').join('+')
    base64url = Buffer.from(base64url, 'base64')
    const image = await jimp.read(base64url)
    image.blur(10)
    const buffer = await image.getBufferAsync(jimp.MIME_PNG)
    
    return streamifier.createReadStream(buffer)
}

export {
    blur
}