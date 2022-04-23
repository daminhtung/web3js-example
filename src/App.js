import "./App.css"
import Web3 from "web3"
import { useCallback, useEffect, useState } from "react"
import detectEthereumProvider from "@metamask/detect-provider"
import { loadContract } from "./utils/contracts"

function App() {
  const [web3API, setWeb3API] = useState({
    provider: null,
    web3: null,
    contract: null,
  })

  const [account, setAccount] = useState(null)
  const [balance, setBalance] = useState(null)
  const [shouldReload, reload] = useState([])
  const reloadEffect = () => reload(!shouldReload)

  useEffect(() => {
    const loadProvider = async () => {
      const provider = await detectEthereumProvider()
      const contract = await loadContract("Faucet", provider)

      if (provider) {
        setWeb3API({
          web3: new Web3(provider),
          provider,
          contract,
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

  useEffect(() => {
    const loadBalance = async () => {
      const { contract, web3 } = web3API
      const balance = await web3.eth.getBalance(contract.address)
      setBalance(web3.utils.fromWei(balance, "ether"))
    }
    web3API.contract && loadBalance()
  }, [web3API, shouldReload])

  const addFunds = useCallback(async () => {
    const { contract, web3 } = web3API
    await contract.addFunds({
      from: account,
      value: web3.utils.toWei(`1`, "ether"),
    })
    reloadEffect()
  }, [web3API, account])

  const withdraw = useCallback(async () => {
    const { contract, web3 } = web3API
    const withdrawAmount = web3.utils.toWei("1", "ether")
    await contract.withDraw(withdrawAmount, {
      from: account
    })
    reloadEffect()
  })

  return (
    <div className="faucet-wrapper">
      <div className="faucet">
        <div className="balance-view is-size-2">
          Current Balance: <strong>{balance} ETH</strong>
        </div>
        <div className="mb-2">
          <button className="button is-primary" onClick={addFunds}>
            Donate
          </button>
          <button className="button is-danger mx-5" onClick={withdraw}>Withdraw</button>
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
