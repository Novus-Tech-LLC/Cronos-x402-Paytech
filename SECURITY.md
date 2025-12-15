# Security Policy

## Supported Versions

We actively support the following versions with security updates:

| Version | Supported          |
| ------- | ------------------ |
| 1.0.x   | :white_check_mark: |

## Reporting a Vulnerability

We take security vulnerabilities seriously. If you discover a security vulnerability, please follow these steps:

1. **Do NOT** open a public GitHub issue
2. Email security concerns to: security@novustechllc.com (or create a private security advisory)
3. Include:
   - Description of the vulnerability
   - Steps to reproduce
   - Potential impact
   - Suggested fix (if any)

4. We will:
   - Acknowledge receipt within 48 hours
   - Provide an initial assessment within 7 days
   - Keep you informed of progress
   - Credit you in the security advisory (if desired)

## Security Best Practices

### For Users

- Always verify contract addresses before interacting
- Use testnet for testing
- Never share private keys
- Review transaction details before signing
- Use hardware wallets for large amounts

### For Developers

- Review all smart contract code before deployment
- Use established libraries (OpenZeppelin)
- Follow security best practices
- Conduct security audits for mainnet deployments
- Keep dependencies updated
- Use environment variables for sensitive data

## Known Security Considerations

### Smart Contracts

- **Reentrancy Protection**: Contracts use ReentrancyGuard
- **Access Control**: Owner and agent authorization checks
- **Input Validation**: All inputs are validated
- **Deadline Checks**: Payment requests expire after deadline

### Frontend

- **Wallet Integration**: Uses established libraries (RainbowKit, Wagmi)
- **Environment Variables**: Sensitive data in environment variables
- **HTTPS**: Always use HTTPS in production

## Audit Status

- [ ] Initial security review completed
- [ ] Professional audit (planned)
- [ ] Bug bounty program (planned)

## Disclosure Policy

We follow responsible disclosure:

1. Report privately
2. Allow time for fix
3. Coordinate public disclosure
4. Credit the reporter

## Security Updates

Security updates will be:
- Released as patches
- Documented in release notes
- Communicated to users
- Tagged with security labels

## Additional Resources

- [OpenZeppelin Security](https://docs.openzeppelin.com/contracts/security)
- [Consensys Best Practices](https://consensys.github.io/smart-contract-best-practices/)
- [Cronos Security](https://docs.cronos.org/security)

---

**Remember**: Smart contracts are immutable once deployed. Always test thoroughly on testnet before mainnet deployment.

