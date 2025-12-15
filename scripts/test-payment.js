const hre = require("hardhat");

/**
 * Test script to verify payment functionality after deployment
 * Usage: npx hardhat run scripts/test-payment.js --network cronosTestnet
 */
async function main() {
  const [deployer, agent, recipient] = await hre.ethers.getSigners();

  console.log("Testing payment functionality...");
  console.log("Deployer:", deployer.address);
  console.log("Agent:", agent.address);
  console.log("Recipient:", recipient.address);

  // Get contract addresses from environment or use defaults
  const facilitatorAddress = process.env.X402_FACILITATOR_ADDRESS;
  const managerAddress = process.env.AGENT_PAYMENT_MANAGER_ADDRESS;

  if (!facilitatorAddress) {
    console.error("Error: X402_FACILITATOR_ADDRESS not set in environment");
    console.log("Please set it in your .env file or export it:");
    console.log("export X402_FACILITATOR_ADDRESS=0x...");
    process.exit(1);
  }

  console.log("\n=== Loading Contracts ===");
  const X402PaymentFacilitator = await hre.ethers.getContractFactory("X402PaymentFacilitator");
  const facilitator = X402PaymentFacilitator.attach(facilitatorAddress);

  console.log("X402PaymentFacilitator:", facilitatorAddress);

  // Check if agent is authorized
  console.log("\n=== Checking Agent Authorization ===");
  const isAuthorized = await facilitator.authorizedAgents(agent.address);
  console.log("Agent authorized:", isAuthorized);

  if (!isAuthorized) {
    console.log("Authorizing agent...");
    const tx = await facilitator.authorizeAgent(agent.address);
    await tx.wait();
    console.log("Agent authorized!");
  }

  // Create a test payment request
  console.log("\n=== Creating Payment Request ===");
  const amount = hre.ethers.parseEther("0.1");
  const deadline = Math.floor(Date.now() / 1000) + 3600; // 1 hour

  const createTx = await facilitator.connect(agent).createPaymentRequest(
    recipient.address,
    hre.ethers.ZeroAddress, // Native CRO
    amount,
    deadline
  );
  const createReceipt = await createTx.wait();

  // Extract request ID from event
  const event = createReceipt.logs.find(
    (log) => {
      try {
        const parsed = facilitator.interface.parseLog(log);
        return parsed && parsed.name === "PaymentRequestCreated";
      } catch {
        return false;
      }
    }
  );

  if (!event) {
    console.error("Error: PaymentRequestCreated event not found");
    return;
  }

  const parsedEvent = facilitator.interface.parseLog(event);
  const requestId = parsedEvent.args.requestId;

  console.log("Payment request created!");
  console.log("Request ID:", requestId);
  console.log("Amount:", hre.ethers.formatEther(amount), "CRO");
  console.log("Recipient:", recipient.address);

  // Get payment request details
  console.log("\n=== Payment Request Details ===");
  const paymentRequest = await facilitator.getPaymentRequest(requestId);
  console.log("Recipient:", paymentRequest.recipient);
  console.log("Token:", paymentRequest.token);
  console.log("Amount:", hre.ethers.formatEther(paymentRequest.amount), "CRO");
  console.log("Deadline:", new Date(Number(paymentRequest.deadline) * 1000).toISOString());
  console.log("Executed:", paymentRequest.executed);
  console.log("Agent:", paymentRequest.agent);

  // Check balances
  console.log("\n=== Balance Check ===");
  const recipientBalanceBefore = await hre.ethers.provider.getBalance(recipient.address);
  console.log("Recipient balance before:", hre.ethers.formatEther(recipientBalanceBefore), "CRO");

  // Execute payment (optional - uncomment to test)
  /*
  console.log("\n=== Executing Payment ===");
  const executeTx = await facilitator.connect(deployer).executePayment(requestId, {
    value: amount,
  });
  const executeReceipt = await executeTx.wait();
  console.log("Payment executed!");
  console.log("Transaction hash:", executeReceipt.hash);

  const recipientBalanceAfter = await hre.ethers.provider.getBalance(recipient.address);
  console.log("Recipient balance after:", hre.ethers.formatEther(recipientBalanceAfter), "CRO");
  console.log("Balance increase:", hre.ethers.formatEther(recipientBalanceAfter - recipientBalanceBefore), "CRO");
  */

  console.log("\n=== Test Complete ===");
  console.log("Payment request created successfully!");
  console.log("To execute the payment, use the frontend or call executePayment() with the request ID");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });

