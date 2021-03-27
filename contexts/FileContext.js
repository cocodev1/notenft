import { createContext } from 'react'

export default createContext({
    file: null,
    extension: null,
    setExtension: () => {},
    setFile: () => {}
})