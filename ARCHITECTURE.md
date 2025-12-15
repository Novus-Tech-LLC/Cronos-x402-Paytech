# Architecture Documentation

## System Overview

Cronos x402 Paytech is a full-stack decentralized application (dApp) that enables AI agents to autonomously create and execute payments on the Cronos blockchain using the x402 protocol.

## Technology Stack

### Smart Contracts Layer
- **Solidity 0.8.20**: Smart contract programming language
- **Hardhat**: Development environment and testing framework
- **OpenZeppelin Contracts**: Secure, audited smart contract libraries
- **Ethers.js v6**: Ethereum JavaScript library

### Frontend Layer
- **Next.js 14**: React framework with App Router
- **React 18**: UI library
- **TypeScript**: Type-safe JavaScript
- **Wagmi v2**: React hooks for Ethereum
- **RainbowKit**: Wallet connection UI
- **Tailwind CSS**: Utility-first CSS framework
- **Viem**: TypeScript Ethereum library

### Infrastructure
- **Cronos EVM**: Blockchain network (Testnet: Chain ID 338, Mainnet: Chain ID 25)
- **CronosScan**: Block explorer for contract verification
- **WalletConnect**: Multi-wallet connection protocol

## System Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                      User Interface                          │
│  ┌──────────────────────────────────────────────────────┐  │
│  │              Next.js Frontend (React)                 │  │
│  │  - Payment Request Creation UI                        │  │
│  │  - Payment Execution Interface                        │  │
│  │  - Wallet Connection (RainbowKit)                     │  │
│  │  - Transaction Status Tracking                        │  │
│  └──────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────┘
                            │
                            ▼
┌─────────────────────────────────────────────────────────────┐
│                    API Layer (Next.js)                       │
│  ┌──────────────────────────────────────────────────────┐  │
│  │  /api/agent/payment    - Create payment via agent    │  │
│  │  /api/agent/execute    - Execute payment via agent   │  │
│  │  /api/agent/status     - Get payment status          │  │
│  └──────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────┘
                            │
                            ▼
┌─────────────────────────────────────────────────────────────┐
│              Blockchain Interaction Layer                    │
│  ┌──────────────────────────────────────────────────────┐  │
│  │  Wagmi + Viem                                         │  │
│  │  - Contract interaction                               │  │
│  │  - Transaction management                            │  │
│  │  - Event listening                                    │  │
│  └──────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────┘
                            │
                            ▼
┌─────────────────────────────────────────────────────────────┐
│                  Smart Contracts (Cronos EVM)                │
│  ┌──────────────────────────┐  ┌────────────────────────┐ │
│  │ X402PaymentFacilitator   │  │ AgentPaymentManager   │ │
│  │                          │  │                       │ │
│  │ - Payment Requests       │  │ - Recurring Payments  │ │
│  │ - Payment Execution      │  │ - Conditional Payments│ │
│  │ - Agent Authorization    │  │ - Workflow Management │ │
│  │ - Batch Processing       │  │                       │ │
│  └──────────────────────────┘  └────────────────────────┘ │
└─────────────────────────────────────────────────────────────┘
                            │
                            ▼
┌─────────────────────────────────────────────────────────────┐
│                    Cronos EVM Network                        │
│              (Testnet: 338, Mainnet: 25)                    │
└─────────────────────────────────────────────────────────────┘
```

## Smart Contract Architecture

### X402PaymentFacilitator

**Purpose**: Core contract for x402-compatible payment facilitation

**Key Components**:
- Payment request creation and management
- Payment execution (native CRO and ERC-20)
- Agent authorization system
- Batch payment processing

**State Variables**:
```solidity
mapping(bytes32 => PaymentRequest) public paymentRequests;
mapping(address => bool) public authorizedAgents;
```

**Key Functions**:
- `createPaymentRequest()`: Creates a new payment request (agent-only)
- `executePayment()`: Executes a payment request
- `batchExecutePayments()`: Executes multiple payments
- `authorizeAgent()`: Grants agent permissions
- `getPaymentRequest()`: Queries payment details

**Security Features**:
- ReentrancyGuard protection
- Access control (owner + authorized agents)
- Deadline validation
- Input validation

### AgentPaymentManager

**Purpose**: Advanced payment workflow management

**Key Components**:
- Recurring payment schedules
- Conditional payment logic
- Multi-step settlement workflows

**State Variables**:
```solidity
mapping(bytes32 => RecurringPayment) public recurringPayments;
mapping(bytes32 => ConditionalPayment) public conditionalPayments;
mapping(address => bytes32[]) public agentRecurringPayments;
```

**Key Functions**:
- `createRecurringPayment()`: Sets up recurring payments
- `executeRecurringPayment()`: Executes due recurring payment
- `createConditionalPayment()`: Creates conditional payment
- `executeConditionalPayment()`: Executes if condition met

## Data Flow

### Payment Request Creation Flow

```
1. User/AI Agent → Frontend UI
2. Frontend → Wagmi Hook (useWriteContract)
3. Wagmi → Wallet (MetaMask/Crypto.com DeFi Wallet)
4. Wallet → User Approval
5. Wallet → Cronos EVM Transaction
6. Transaction → X402PaymentFacilitator.createPaymentRequest()
7. Contract → Emit PaymentRequestCreated Event
8. Event → Frontend (via Wagmi)
9. Frontend → Display Success/Status
```

### Payment Execution Flow

```
1. User → Frontend (Enter Request ID)
2. Frontend → Wagmi Hook
3. Wagmi → Wallet
4. Wallet → User Approval (with CRO amount)
5. Wallet → Cronos EVM Transaction
6. Transaction → X402PaymentFacilitator.executePayment()
7. Contract → Transfer CRO/Token to Recipient
8. Contract → Emit PaymentExecuted Event
9. Event → Frontend
10. Frontend → Display Success
```

## Security Architecture

### Smart Contract Security

1. **Access Control**
   - Owner-only functions for critical operations
   - Authorized agent system for payment creation
   - Role-based permissions

2. **Reentrancy Protection**
   - ReentrancyGuard on all state-changing functions
   - Checks-Effects-Interactions pattern

3. **Input Validation**
   - Zero address checks
   - Amount validation
   - Deadline validation
   - Request existence checks

4. **Error Handling**
   - Custom error messages
   - Require statements with clear messages
   - Safe external calls

### Frontend Security

1. **Wallet Integration**
   - Established libraries (RainbowKit, Wagmi)
   - No private key handling
   - User-controlled transactions

2. **Environment Variables**
   - Sensitive data in `.env` (not committed)
   - Public variables prefixed with `NEXT_PUBLIC_`

3. **HTTPS**
   - Always use HTTPS in production
   - Secure WebSocket connections

## Integration Points

### Crypto.com AI Agent SDK

The project includes integration points for Crypto.com's AI Agent SDK:

```typescript
// lib/ai-agent-sdk.ts
- initializeAIAgent()
- createPaymentRequest()
- executePayment()
- getPaymentStatus()
```

### x402 Protocol

The contracts implement x402-compatible interfaces:

```solidity
// contracts/interfaces/IX402Facilitator.sol
- createPaymentRequest()
- executePayment()
- getPaymentRequest()
```

## Deployment Architecture

### Development
- Local Hardhat network
- Next.js dev server (localhost:3000)
- Hot reloading enabled

### Testnet
- Cronos Testnet (Chain ID: 338)
- Public RPC: https://evm-t3.cronos.org
- Testnet CRO from faucet

### Mainnet
- Cronos Mainnet (Chain ID: 25)
- Public RPC: https://evm.cronos.org
- Real CRO required

## Scalability Considerations

1. **Gas Optimization**
   - Batch payment execution
   - Efficient storage patterns
   - Optimized Solidity compiler settings

2. **Frontend Performance**
   - Next.js server-side rendering
   - Code splitting
   - Optimized bundle size

3. **Network Performance**
   - Cronos EVM fast block times (<1s)
   - Low gas fees
   - High throughput

## Monitoring and Observability

### Smart Contracts
- Events for all important state changes
- CronosScan for transaction tracking
- Contract verification on CronosScan

### Frontend
- Transaction status tracking
- Error handling and user feedback
- Console logging for debugging

## Future Enhancements

1. **Multi-signature Support**
   - Require multiple approvals for large payments

2. **Payment Scheduling UI**
   - Visual interface for recurring payments

3. **Analytics Dashboard**
   - Payment statistics and trends

4. **Mobile App**
   - React Native implementation

5. **Additional Integrations**
   - More DEX integrations
   - Cross-chain support
   - NFT payment support

## References

- [Cronos Documentation](https://docs.cronos.org)
- [x402 Protocol](https://x402.org)
- [Crypto.com AI Agent SDK](https://ai-agent-sdk-docs.crypto.com)
- [OpenZeppelin Contracts](https://docs.openzeppelin.com/contracts)

