# Quick Start Guide

Get up and running with Cronos x402 Paytech in 5 minutes!

## Prerequisites Check

- [ ] Node.js 18+ installed (`node --version`)
- [ ] npm or yarn installed
- [ ] Git installed
- [ ] MetaMask or Crypto.com DeFi Wallet installed

## Step 1: Clone and Install (2 minutes)

```bash
# Clone the repository
git clone https://github.com/Novus-Tech-LLC/Cronos-x402-Paytech.git
cd Cronos-x402-Paytech

# Install dependencies
npm install
```

## Step 2: Configure Environment (1 minute)

```bash
# Copy environment template
cp .env.example .env

# Edit .env file (add your private key for deployment)
# For testing, you can skip PRIVATE_KEY if not deploying
```

Minimum `.env` configuration for frontend:

```env
NEXT_PUBLIC_CHAIN_ID=338
NEXT_PUBLIC_RPC_URL=https://evm-t3.cronos.org
NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID=your_project_id
```

## Step 3: Compile Contracts (30 seconds)

```bash
npm run compile
```

## Step 4: Run Tests (1 minute)

```bash
npm test
```

You should see all tests passing! ✅

## Step 5: Start Frontend (30 seconds)

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Step 6: Connect Wallet

1. Click "Connect Wallet" button
2. Select your wallet (MetaMask, WalletConnect, etc.)
3. Switch to Cronos Testnet (Chain ID: 338)
4. Get testnet CRO from [faucet](https://cronos.org/faucet) if needed

## Next Steps

### For Development

- Read [README.md](README.md) for full documentation
- Check [CONTRIBUTING.md](CONTRIBUTING.md) for development guidelines
- Review smart contracts in `contracts/` directory

### For Deployment

- Follow [DEPLOYMENT.md](DEPLOYMENT.md) for deployment instructions
- Deploy to testnet: `npm run deploy:testnet`
- Update `.env` with deployed contract addresses

### For Testing

- Run test script: `npx hardhat run scripts/test-payment.js --network cronosTestnet`
- Check contract interactions on [CronosScan Testnet](https://testnet.cronoscan.com)

## Troubleshooting

### "Cannot find module" errors

```bash
# Clear cache and reinstall
rm -rf node_modules package-lock.json
npm install
```

### Contract compilation errors

```bash
# Ensure OpenZeppelin contracts are installed
npm install @openzeppelin/contracts
npm run compile
```

### Frontend won't start

```bash
# Check Node.js version
node --version  # Should be 18+

# Clear Next.js cache
rm -rf .next
npm run dev
```

### Wallet connection issues

- Ensure you're on Cronos Testnet (Chain ID: 338)
- Add network manually if needed:
  - Network Name: Cronos Testnet
  - RPC URL: https://evm-t3.cronos.org
  - Chain ID: 338
  - Currency Symbol: TCRO

## Getting Help

- 📖 Read the [full README](README.md)
- 💬 Join [Cronos Discord](https://discord.com/channels/783264383978569728/1442807140103487610)
- 🐛 Open an [issue on GitHub](https://github.com/Novus-Tech-LLC/Cronos-x402-Paytech/issues)

## What's Next?

Now that you're set up, explore:

1. **Smart Contracts**: Check out `contracts/X402PaymentFacilitator.sol`
2. **Frontend**: Modify `app/page.tsx` to customize the UI
3. **API Routes**: Explore `app/api/agent/` for AI agent integration
4. **Tests**: Add more tests in `test/` directory

Happy building! 🚀

