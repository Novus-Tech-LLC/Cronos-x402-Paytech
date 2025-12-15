# Contributing to Cronos x402 Paytech

Thank you for your interest in contributing! This document provides guidelines and instructions for contributing to the project.

## Code of Conduct

- Be respectful and inclusive
- Welcome newcomers and help them learn
- Focus on constructive feedback
- Follow the project's coding standards

## Getting Started

1. Fork the repository
2. Clone your fork: `git clone https://github.com/YOUR_USERNAME/Cronos-x402-Paytech.git`
3. Create a branch: `git checkout -b feature/your-feature-name`
4. Make your changes
5. Test thoroughly
6. Submit a pull request

## Development Workflow

### Setting Up Development Environment

```bash
# Install dependencies
npm install

# Compile contracts
npm run compile

# Run tests
npm test

# Start dev server
npm run dev
```

### Coding Standards

#### Solidity

- Follow [Solidity Style Guide](https://docs.soliditylang.org/en/latest/style-guide.html)
- Use meaningful variable and function names
- Add NatSpec comments for public functions
- Keep functions focused and small
- Use events for important state changes

#### TypeScript/JavaScript

- Follow [TypeScript Style Guide](https://google.github.io/styleguide/tsguide.html)
- Use meaningful variable names
- Add JSDoc comments for complex functions
- Use async/await over promises
- Handle errors appropriately

#### React/Next.js

- Use functional components with hooks
- Keep components small and focused
- Use TypeScript for type safety
- Follow Next.js best practices

### Commit Messages

Follow [Conventional Commits](https://www.conventionalcommits.org/):

```
feat: add recurring payment feature
fix: resolve payment execution bug
docs: update README with deployment steps
test: add tests for batch payments
refactor: simplify payment request creation
```

### Testing

- Write tests for all new features
- Maintain or improve test coverage
- Test both success and failure cases
- Test edge cases and boundary conditions

### Pull Request Process

1. **Update Documentation**
   - Update README if needed
   - Add comments for complex code
   - Update API documentation

2. **Write Tests**
   - Add unit tests for new features
   - Ensure all tests pass
   - Add integration tests if applicable

3. **Check Linting**
   ```bash
   npm run lint
   ```

4. **Create Pull Request**
   - Use a descriptive title
   - Explain what and why in the description
   - Reference related issues
   - Add screenshots for UI changes

5. **Review Process**
   - Address review comments
   - Keep discussions constructive
   - Update PR based on feedback

## Project Structure

```
Cronos-x402-Paytech/
├── contracts/          # Solidity smart contracts
├── scripts/            # Deployment scripts
├── test/               # Test files
├── app/                # Next.js application
├── lib/                # Utility libraries
└── docs/               # Documentation
```

## Areas for Contribution

### High Priority

- Additional test coverage
- Security audit improvements
- Performance optimizations
- Documentation improvements
- UI/UX enhancements

### Feature Ideas

- Multi-signature support
- Payment scheduling UI
- Analytics dashboard
- Mobile app
- Additional token support
- Integration with more DEXs

### Bug Fixes

- Check open issues
- Reproduce bugs
- Write tests
- Submit fixes

## Security

If you discover a security vulnerability:

1. **DO NOT** open a public issue
2. Email security concerns to the maintainers
3. Provide detailed information
4. Allow time for response before disclosure

## Questions?

- Open an issue for questions
- Join the [Cronos Discord](https://discord.com/channels/783264383978569728/1442807140103487610)
- Check existing documentation

Thank you for contributing! 🎉

