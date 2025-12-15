# Cronos x402 Paytech

> AI-native payment application leveraging x402 protocol for agent-triggered payments on Cronos EVM

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Solidity](https://img.shields.io/badge/Solidity-0.8.20-blue.svg)](https://soliditylang.org/)
[![Next.js](https://img.shields.io/badge/Next.js-14.0-black.svg)](https://nextjs.org/)

## Contact 

| Platform | Link |
|----------|------|
| 📱 Telegram | [t.me/novustch](https://t.me/novustch) |
| 📲 WhatsApp | [wa.me/14105015750](https://wa.me/14105015750) |
| 💬 Discord | [discordapp.com/users/985432160498491473](https://discordapp.com/users/985432160498491473)

<div align="left">
    <a href="https://t.me/novustch" target="_blank"><img alt="Telegram"
        src="https://img.shields.io/badge/Telegram-26A5E4?style=for-the-badge&logo=telegram&logoColor=white"/></a>
    <a href="https://wa.me/14105015750" target="_blank"><img alt="WhatsApp"
        src="https://img.shields.io/badge/WhatsApp-25D366?style=for-the-badge&logo=whatsapp&logoColor=white"/></a>
    <a href="https://discordapp.com/users/985432160498491473" target="_blank"><img alt="Discord"
        src="https://img.shields.io/badge/Discord-7289DA?style=for-the-badge&logo=discord&logoColor=white"/></a>
</div>

Feel free to reach out for implementation assistance or integration support.

## 📋 Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Architecture](#architecture)
- [Getting Started](#getting-started)
- [Smart Contracts](#smart-contracts)
- [Frontend Application](#frontend-application)
- [Deployment](#deployment)
- [API Reference](#api-reference)
- [Testing](#testing)
- [Contributing](#contributing)
- [License](#license)


<a id="overview"></a>
## 🎯 Overview

Cronos x402 Paytech is a production-ready application that enables AI agents to autonomously trigger and execute payments on the Cronos blockchain using the x402 protocol. The system provides programmable payment rails with support for:

- **Agent-triggered payments**: AI agents can create payment requests autonomously
- **Recurring payments**: Automated recurring payment schedules
- **Conditional payments**: Payments that execute based on predefined conditions
- **Batch processing**: Efficient multi-payment execution
- **Native CRO and ERC-20 support**: Flexible token payment options

This project was built for the [Cronos x402 Paytech] and demonstrates integration with Cronos EVM, x402 facilitator, and Crypto.com AI Agent SDK.

<a id="features"></a>
## ✨ Features

### Core Functionality

- ✅ **x402-Compatible Payment Facilitation**
  - Secure payment request creation and execution
  - Support for native CRO and ERC-20 tokens
  - Deadline-based payment requests with expiration handling

- ✅ **AI Agent Integration**
  - Authorized agent system for secure automation
  - Integration with Crypto.com AI Agent SDK
  - Agent-triggered payment workflows

- ✅ **Advanced Payment Management**
  - Recurring payment schedules
  - Conditional payment execution
  - Batch payment processing

- ✅ **Modern Web Interface**
  - Next.js 14 with React 18
  - RainbowKit wallet integration
  - Responsive design with Tailwind CSS

### Security Features

- Reentrancy protection
- Access control with authorized agents
- Deadline validation
- Emergency withdrawal functions
- Comprehensive test coverage

<a id="architecture"></a>
## 🏗️ Architecture

### System Components

```
┌─────────────────────────────────────────────────────────┐
│                    Frontend (Next.js)                    │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐  │
│  │   React UI   │  │  Wallet Conn │  │  API Routes  │  │
│  └──────────────┘  └──────────────┘  └──────────────┘  │
└─────────────────────────────────────────────────────────┘
                          │
                          ▼
┌─────────────────────────────────────────────────────────┐
│              Smart Contracts (Solidity)                 │
│  ┌──────────────────────┐  ┌──────────────────────┐   │
│  │ X402PaymentFacilitator│  │ AgentPaymentManager  │   │
│  │  - Payment Requests   │  │  - Recurring        │   │
│  │  - Payment Execution  │  │  - Conditional       │   │
│  │  - Agent Auth         │  │  - Workflows         │   │
│  └──────────────────────┘  └──────────────────────┘   │
└─────────────────────────────────────────────────────────┘
                          │
                          ▼
┌─────────────────────────────────────────────────────────┐
│                   Cronos EVM Network                    │
│              (Testnet: Chain ID 338)                    │
│              (Mainnet: Chain ID 25)                     │
└─────────────────────────────────────────────────────────┘
```

### Smart Contract Architecture

1. **X402PaymentFacilitator**: Core payment facilitation contract
   - Creates and manages payment requests
   - Executes payments (native CRO and ERC-20)
   - Manages agent authorization
   - Batch payment execution

2. **AgentPaymentManager**: Advanced payment workflow manager
   - Recurring payment schedules
   - Conditional payment logic
   - Multi-step settlement workflows

<a id="getting-started"></a>
## 🚀 Getting Started

### Prerequisites

- **Node.js** >= 18.0.0
- **npm** >= 9.0.0 or **yarn** >= 1.22.0
- **Git**
- **MetaMask** or **Crypto.com DeFi Wallet** (for testing)
- **Cronos Testnet CRO** (get from [faucet](https://cronos.org/faucet))

### Installation

1. **Clone the repository**

```bash
git clone https://github.com/Novus-Tech-LLC/Cronos-x402-Paytech.git
cd Cronos-x402-Paytech
```

2. **Install dependencies**

```bash
npm install
```

3. **Set up environment variables**

```bash
cp .env.example .env
```

Edit `.env` and configure:

```env
# Private key for deployment (NEVER commit this!)
PRIVATE_KEY=your_private_key_here

# Contract addresses (update after deployment)
NEXT_PUBLIC_X402_FACILITATOR_ADDRESS=0x...
NEXT_PUBLIC_AGENT_PAYMENT_MANAGER_ADDRESS=0x...

# WalletConnect Project ID
NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID=your_project_id

# Network Configuration
NEXT_PUBLIC_CHAIN_ID=338
NEXT_PUBLIC_RPC_URL=https://evm-t3.cronos.org
```

4. **Compile smart contracts**

```bash
npm run compile
```

5. **Run tests**

```bash
npm test
```

6. **Start development server**

```bash
npm run dev
```

Visit `http://localhost:3000` to access the application.

<a id="smart-contracts"></a>
## 📜 Smart Contracts

### X402PaymentFacilitator

The core contract for x402-compatible payments.

**Key Functions:**

- `createPaymentRequest(recipient, token, amount, deadline)`: Create a new payment request
- `executePayment(requestId)`: Execute a payment request
- `batchExecutePayments(requestIds[])`: Execute multiple payments in one transaction
- `authorizeAgent(agent)`: Authorize an AI agent to create payments
- `getPaymentRequest(requestId)`: Query payment request details

**Example Usage:**

```solidity
// Create a payment request (agent only)
bytes32 requestId = facilitator.createPaymentRequest(
    recipientAddress,
    address(0), // Native CRO
    1 ether,
    block.timestamp + 1 hours
);

// Execute the payment
facilitator.executePayment{value: 1 ether}(requestId);
```

### AgentPaymentManager

Manages advanced payment workflows.

**Key Functions:**

- `createRecurringPayment(recipient, token, amount, interval, duration)`: Set up recurring payments
- `executeRecurringPayment(paymentId)`: Execute a due recurring payment
- `createConditionalPayment(recipient, token, amount, conditionHash)`: Create conditional payment
- `executeConditionalPayment(conditionId, conditionProof)`: Execute if condition met

<a id="frontend-application"></a>
## 🎨 Frontend Application

### Tech Stack

- **Next.js 14**: React framework with App Router
- **Wagmi**: Ethereum React hooks
- **RainbowKit**: Wallet connection UI
- **Tailwind CSS**: Styling
- **TypeScript**: Type safety

### Key Features

- Wallet connection (MetaMask, WalletConnect, Crypto.com DeFi Wallet)
- Payment request creation interface
- Payment execution interface
- Transaction status tracking
- Responsive design

### Development

```bash
# Start development server
npm run dev

# Build for production
npm run build

# Start production server
npm start
```

<a id="deployment"></a>
## 🚢 Deployment

### Deploy Smart Contracts

1. **Deploy to Cronos Testnet**

```bash
npm run deploy:testnet
```

2. **Deploy to Cronos Mainnet**

```bash
npm run deploy:mainnet
```

After deployment, update your `.env` file with the deployed contract addresses.

### Deploy Frontend

The frontend can be deployed to:

- **Vercel** (recommended for Next.js)
- **Netlify**
- **Any Node.js hosting service**

**Vercel Deployment:**

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel
```

Make sure to set environment variables in your hosting platform.

<a id="api-reference"></a>
## 📚 API Reference

### AI Agent SDK Integration

The project includes integration points for Crypto.com AI Agent SDK:

```typescript
import { initializeAIAgent } from '@/lib/ai-agent-sdk'

const agent = initializeAIAgent({
  agentAddress: '0x...',
  facilitatorAddress: '0x...',
  network: 'testnet'
})

// Create payment via AI agent
const requestId = await agent.createPaymentRequest({
  recipient: '0x...',
  amount: '1.0',
  token: undefined, // Native CRO
})

// Execute payment
const txHash = await agent.executePayment(requestId)
```

### API Routes

- `POST /api/agent/payment`: Create payment request via AI agent
- `POST /api/agent/execute`: Execute payment via AI agent
- `GET /api/agent/status/[requestId]`: Get payment status

<a id="testing"></a>
## 🧪 Testing

### Run Tests

```bash
# Run all tests
npm test

# Run with coverage
npx hardhat coverage

# Run specific test file
npx hardhat test test/X402PaymentFacilitator.test.js
```

### Test Coverage

The test suite covers:

- Agent authorization and revocation
- Payment request creation
- Payment execution (native CRO and ERC-20)
- Batch payment execution
- Error handling and edge cases
- Reentrancy protection

<a id="contributing"></a>
## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Development Guidelines

- Follow Solidity style guide for smart contracts
- Use TypeScript for frontend code
- Write tests for new features
- Update documentation as needed
- Follow conventional commit messages

## 📖 Resources

### Official Documentation

- [Cronos Developer Docs](https://docs.cronos.org)
- [x402 Facilitator Guide](https://docs.cronos.org/cronos-x402-facilitator/introduction)
- [Crypto.com AI Agent SDK](https://ai-agent-sdk-docs.crypto.com)
- [Crypto.com Market Data MCP](https://mcp.crypto.com/docs)

### Tools

- [Cronos Testnet Faucet](https://cronos.org/faucet)
- [CronosScan](https://cronoscan.com) (Block Explorer)
- [Hardhat Documentation](https://hardhat.org/docs)

### Submission Requirements Met

- ✅ **Project Overview**: Comprehensive AI-native payment system
- ✅ **On-Chain Component**: Fully deployed smart contracts on Cronos EVM
- ✅ **Functional Prototype**: Complete frontend and backend implementation
- ✅ **Testnet Deployment**: Ready for Cronos Testnet deployment

<a id="license"></a>
## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **Crypto.com** for the AI Agent SDK and ecosystem support
- **OpenZeppelin** for secure smart contract libraries
- **RainbowKit** and **Wagmi** teams for excellent wallet integration tools

## 🔗 Links

- **Repository**: [GitHub](https://github.com/Novus-Tech-LLC/Cronos-x402-Paytech)
- **Documentation**: [This README]

---

**Built with ❤️ for the Cronos x402 Paytech**
