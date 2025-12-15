'use client'

import { ConnectButton } from '@rainbow-me/rainbowkit'
import { useAccount, useWriteContract, useWaitForTransactionReceipt } from 'wagmi'
import { useState } from 'react'
import { parseEther, formatEther } from 'viem'
import { X402PaymentFacilitatorABI } from '../contracts/abis/X402PaymentFacilitator'

const X402_FACILITATOR_ADDRESS = process.env.NEXT_PUBLIC_X402_FACILITATOR_ADDRESS || '0x0000000000000000000000000000000000000000'

export default function Home() {
  const { address, isConnected } = useAccount()
  const [recipient, setRecipient] = useState('')
  const [amount, setAmount] = useState('')
  const [requestId, setRequestId] = useState('')

  const { writeContract, data: hash, isPending, error } = useWriteContract()
  const { isLoading: isConfirming, isSuccess: isConfirmed } = useWaitForTransactionReceipt({ hash })

  const handleCreatePaymentRequest = async () => {
    if (!recipient || !amount) {
      alert('Please fill in all fields')
      return
    }

    const deadline = Math.floor(Date.now() / 1000) + 3600 // 1 hour from now

    try {
      await writeContract({
        address: X402_FACILITATOR_ADDRESS as `0x${string}`,
        abi: X402PaymentFacilitatorABI,
        functionName: 'createPaymentRequest',
        args: [
          recipient as `0x${string}`,
          '0x0000000000000000000000000000000000000000', // Native CRO
          parseEther(amount),
          BigInt(deadline),
        ],
      })
    } catch (err) {
      console.error('Error creating payment request:', err)
    }
  }

  const handleExecutePayment = async () => {
    if (!requestId) {
      alert('Please enter a request ID')
      return
    }

    try {
      await writeContract({
        address: X402_FACILITATOR_ADDRESS as `0x${string}`,
        abi: X402PaymentFacilitatorABI,
        functionName: 'executePayment',
        args: [requestId as `0x${string}`],
        value: parseEther(amount || '0'),
      })
    } catch (err) {
      console.error('Error executing payment:', err)
    }
  }

  return (
    <main className="min-h-screen p-8">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-4xl font-bold">Cronos x402 Paytech</h1>
          <ConnectButton />
        </div>

        {!isConnected ? (
          <div className="text-center py-12">
            <p className="text-xl mb-4">Connect your wallet to get started</p>
            <p className="text-gray-600">Use Cronos-compatible wallets like Crypto.com DeFi Wallet</p>
          </div>
        ) : (
          <div className="space-y-8">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
              <h2 className="text-2xl font-semibold mb-4">Create Payment Request</h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Recipient Address</label>
                  <input
                    type="text"
                    value={recipient}
                    onChange={(e) => setRecipient(e.target.value)}
                    className="w-full px-4 py-2 border rounded-lg"
                    placeholder="0x..."
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Amount (CRO)</label>
                  <input
                    type="number"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    className="w-full px-4 py-2 border rounded-lg"
                    placeholder="1.0"
                    step="0.001"
                  />
                </div>
                <button
                  onClick={handleCreatePaymentRequest}
                  disabled={isPending || isConfirming}
                  className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 disabled:opacity-50"
                >
                  {isPending ? 'Creating...' : isConfirming ? 'Confirming...' : 'Create Payment Request'}
                </button>
                {isConfirmed && (
                  <div className="p-4 bg-green-100 rounded-lg">
                    <p className="text-green-800">Payment request created successfully!</p>
                    <p className="text-sm text-green-600 mt-2">Transaction: {hash}</p>
                  </div>
                )}
                {error && (
                  <div className="p-4 bg-red-100 rounded-lg">
                    <p className="text-red-800">Error: {error.message}</p>
                  </div>
                )}
              </div>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
              <h2 className="text-2xl font-semibold mb-4">Execute Payment</h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Payment Request ID</label>
                  <input
                    type="text"
                    value={requestId}
                    onChange={(e) => setRequestId(e.target.value)}
                    className="w-full px-4 py-2 border rounded-lg"
                    placeholder="0x..."
                  />
                </div>
                <button
                  onClick={handleExecutePayment}
                  disabled={isPending || isConfirming}
                  className="w-full bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-700 disabled:opacity-50"
                >
                  {isPending ? 'Executing...' : isConfirming ? 'Confirming...' : 'Execute Payment'}
                </button>
              </div>
            </div>

            <div className="bg-gray-100 dark:bg-gray-900 rounded-lg p-6">
              <h3 className="text-lg font-semibold mb-2">Connected Wallet</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">{address}</p>
            </div>
          </div>
        )}
      </div>
    </main>
  )
}

