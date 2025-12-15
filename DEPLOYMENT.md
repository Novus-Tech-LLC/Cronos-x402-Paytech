# Deployment Guide

This guide walks you through deploying the Cronos x402 Paytech application to Cronos EVM networks.

## Prerequisites

1. **Wallet Setup**
   - Create or import a wallet with sufficient CRO for gas fees
   - For Testnet: Get testnet CRO from [Cronos Faucet](https://cronos.org/faucet)
   - For Mainnet: Ensure you have sufficient CRO for deployment

2. **Environment Configuration**
   - Copy `.env.example` to `.env`
   - Add your private key (NEVER commit this!)
   - Configure network settings

## Step 1: Compile Contracts

```bash
npm run compile
```

This will compile all Solidity contracts and generate artifacts in the `artifacts/` directory.

## Step 2: Deploy to Cronos Testnet

### 2.1 Update Hardhat Config

Ensure your `hardhat.config.js` has the correct testnet configuration:

```javascript
cronosTestnet: {
  url: "https://evm-t3.cronos.org",
  chainId: 338,
  accounts: process.env.PRIVATE_KEY ? [process.env.PRIVATE_KEY] : [],
  gasPrice: 5000000000000, // 5 gwei
}
```

### 2.2 Deploy Contracts

```bash
npm run deploy:testnet
```

This will:
1. Deploy `X402PaymentFacilitator`
2. Deploy `AgentPaymentManager` (linked to facilitator)
3. Display contract addresses
4. Attempt to verify contracts on CronosScan

### 2.3 Save Contract Addresses

After deployment, you'll see output like:

```
X402PaymentFacilitator deployed to: 0x...
AgentPaymentManager deployed to: 0x...
```

Update your `.env` file:

```env
NEXT_PUBLIC_X402_FACILITATOR_ADDRESS=0x...
NEXT_PUBLIC_AGENT_PAYMENT_MANAGER_ADDRESS=0x...
```

## Step 3: Authorize Agents

After deployment, you need to authorize AI agents to create payment requests:

```bash
npx hardhat console --network cronosTestnet
```

Then in the console:

```javascript
const facilitator = await ethers.getContractAt(
  "X402PaymentFacilitator",
  "YOUR_FACILITATOR_ADDRESS"
);

// Authorize an agent
await facilitator.authorizeAgent("AGENT_ADDRESS");
```

## Step 4: Deploy Frontend

### Option A: Vercel (Recommended)

1. **Install Vercel CLI**

```bash
npm i -g vercel
```

2. **Deploy**

```bash
vercel
```

3. **Set Environment Variables**

In Vercel dashboard, add:
- `NEXT_PUBLIC_X402_FACILITATOR_ADDRESS`
- `NEXT_PUBLIC_AGENT_PAYMENT_MANAGER_ADDRESS`
- `NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID`
- `NEXT_PUBLIC_CHAIN_ID`
- `NEXT_PUBLIC_RPC_URL`

### Option B: Other Platforms

The frontend is a standard Next.js application and can be deployed to:
- Netlify
- AWS Amplify
- DigitalOcean App Platform
- Any Node.js hosting service

## Step 5: Mainnet Deployment

⚠️ **Warning**: Only deploy to mainnet after thorough testing on testnet!

1. **Update Configuration**

Ensure mainnet settings in `hardhat.config.js`:

```javascript
cronosMainnet: {
  url: "https://evm.cronos.org",
  chainId: 25,
  accounts: process.env.PRIVATE_KEY ? [process.env.PRIVATE_KEY] : [],
  gasPrice: 5000000000000,
}
```

2. **Deploy**

```bash
npm run deploy:mainnet
```

3. **Verify Contracts**

Contracts will be automatically verified on CronosScan if the plugin is configured.

## Step 6: Post-Deployment Checklist

- [ ] Contracts deployed and verified
- [ ] Contract addresses updated in `.env`
- [ ] Agents authorized
- [ ] Frontend deployed with correct environment variables
- [ ] Test payment request creation
- [ ] Test payment execution
- [ ] Monitor contract interactions on CronosScan

## Verification

### Verify on CronosScan

1. Visit [CronosScan Testnet](https://testnet.cronoscan.com) or [CronosScan Mainnet](https://cronoscan.com)
2. Search for your contract address
3. Verify contract source code (if not auto-verified)

### Test Deployment

```bash
# Test payment request creation
npx hardhat run scripts/test-payment.js --network cronosTestnet
```

## Troubleshooting

### Common Issues

1. **Insufficient Gas**
   - Ensure wallet has enough CRO for deployment
   - Check gas price settings

2. **Verification Fails**
   - Manually verify on CronosScan
   - Ensure constructor arguments are correct

3. **Frontend Can't Connect**
   - Verify contract addresses in `.env`
   - Check network configuration
   - Ensure wallet is connected to correct network

## Security Considerations

- ✅ Never commit private keys
- ✅ Use environment variables for sensitive data
- ✅ Test thoroughly on testnet before mainnet
- ✅ Review contract code before deployment
- ✅ Consider using a multisig for mainnet deployment
- ✅ Monitor contract after deployment

## Support

For deployment issues:
- Check [Cronos Discord](https://discord.com/channels/783264383978569728/1442807140103487610)
- Review [Cronos Documentation](https://docs.cronos.org)
- Open an issue on GitHub

