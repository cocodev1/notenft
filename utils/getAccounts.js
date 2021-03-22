export default async function getAccounts() {
        
    const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
    
    return accounts
}