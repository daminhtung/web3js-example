import "./App.css"
import Web3 from "web3"
import { useEffect, useState } from "react"
import detectEthereumProvider from "@metamask/detect-provider"
import { loadContract } from "../utils/contracts"

function App() {
  const [web3API, setWeb3API] = useState({
    provider: null,
    web3: null,
    contract: null
  })

  const [account, setAccount] = useState(null)

  useEffect(() => {
    const loadProvider = async () => {
      const provider = await detectEthereumProvider()
      const contract = await loadContract("Faucet")

      debugger
      
      if (provider) {
        setWeb3API({
          web3: new Web3(provider),
          provider,
          contract
        })
      } else {
        console.error("Please, Install Metamask!")
      }
    }
    loadProvider()
  }, [])

  useEffect(() => {
    const getAccount = async () => {
      const accounts = await web3API.web3.eth.getAccounts()
      setAccount(accounts[0])
    }
    web3API.web3 && getAccount()
  }, [web3API.web3])

  return (
    <div className="faucet-wrapper">
      <div className="faucet">
        <div className="balance-view is-size-2">
          Current Balance: <strong>10 ETH</strong>
        </div>
        <div className="mb-2">
          <button className="button is-primary">Donate</button>
          <button className="button is-danger mx-5">Withdraw</button>
          <button
            className="button is-secondary"
            onClick={() =>
              web3API.provider.request({ method: "eth_requestAccounts" })
            }
          >
            Connect Wallets
          </button>
        </div>
        <span>
          <p>
            <strong>Accounts Address:</strong>
            {account ? account : "Accounts Denied"}
          </p>
        </span>
      </div>
    </div>
  )
}

export default App
