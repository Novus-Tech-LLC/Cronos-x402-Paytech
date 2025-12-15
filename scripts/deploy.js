const hre = require("hardhat");

async function main() {
  const [deployer] = await hre.ethers.getSigners();

  console.log("Deploying contracts with account:", deployer.address);
  console.log("Account balance:", (await hre.ethers.provider.getBalance(deployer.address)).toString());

  // Deploy X402PaymentFacilitator
  console.log("\nDeploying X402PaymentFacilitator...");
  const X402PaymentFacilitator = await hre.ethers.getContractFactory("X402PaymentFacilitator");
  const paymentFacilitator = await X402PaymentFacilitator.deploy();
  await paymentFacilitator.waitForDeployment();
  const facilitatorAddress = await paymentFacilitator.getAddress();
  console.log("X402PaymentFacilitator deployed to:", facilitatorAddress);

  // Deploy AgentPaymentManager
  console.log("\nDeploying AgentPaymentManager...");
  const AgentPaymentManager = await hre.ethers.getContractFactory("AgentPaymentManager");
  const agentManager = await AgentPaymentManager.deploy(facilitatorAddress);
  await agentManager.waitForDeployment();
  const managerAddress = await agentManager.getAddress();
  console.log("AgentPaymentManager deployed to:", managerAddress);

  console.log("\n=== Deployment Summary ===");
  console.log("Network:", hre.network.name);
  console.log("X402PaymentFacilitator:", facilitatorAddress);
  console.log("AgentPaymentManager:", managerAddress);
  console.log("\nSave these addresses for frontend configuration!");

  // Verify contracts on CronosScan (if on testnet/mainnet)
  if (hre.network.name !== "hardhat") {
    console.log("\nWaiting for block confirmations...");
    await paymentFacilitator.deploymentTransaction()?.wait(5);
    await agentManager.deploymentTransaction()?.wait(5);

    console.log("\nVerifying contracts on CronosScan...");
    try {
      await hre.run("verify:verify", {
        address: facilitatorAddress,
        constructorArguments: [],
      });
    } catch (error) {
      console.log("Verification error (may already be verified):", error.message);
    }

    try {
      await hre.run("verify:verify", {
        address: managerAddress,
        constructorArguments: [facilitatorAddress],
      });
    } catch (error) {
      console.log("Verification error (may already be verified):", error.message);
    }
  }
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });

