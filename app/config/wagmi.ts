import { getDefaultConfig } from '@rainbow-me/rainbowkit'
import { cronos, cronosTestnet } from 'wagmi/chains'

export const config = getDefaultConfig({
  appName: 'Cronos x402 Paytech',
  projectId: process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID || 'your-project-id',
  chains: [cronos, cronosTestnet],
  ssr: true,
})

