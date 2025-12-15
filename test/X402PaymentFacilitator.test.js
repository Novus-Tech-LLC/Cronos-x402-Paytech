const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("X402PaymentFacilitator", function () {
  let paymentFacilitator;
  let owner;
  let agent;
  let recipient;
  let token;

  beforeEach(async function () {
    [owner, agent, recipient] = await ethers.getSigners();

    const X402PaymentFacilitator = await ethers.getContractFactory("X402PaymentFacilitator");
    paymentFacilitator = await X402PaymentFacilitator.deploy();
    await paymentFacilitator.waitForDeployment();

    // Authorize agent
    await paymentFacilitator.authorizeAgent(agent.address);
  });

  describe("Agent Authorization", function () {
    it("Should authorize an agent", async function () {
      const newAgent = (await ethers.getSigners())[3];
      await expect(paymentFacilitator.authorizeAgent(newAgent.address))
        .to.emit(paymentFacilitator, "AgentAuthorized")
        .withArgs(newAgent.address);
    });

    it("Should revoke agent authorization", async function () {
      await expect(paymentFacilitator.revokeAgent(agent.address))
        .to.emit(paymentFacilitator, "AgentRevoked")
        .withArgs(agent.address);
    });
  });

  describe("Payment Requests", function () {
    it("Should create a payment request", async function () {
      const amount = ethers.parseEther("1.0");
      const deadline = Math.floor(Date.now() / 1000) + 3600;

      await expect(
        paymentFacilitator.connect(agent).createPaymentRequest(
          recipient.address,
          ethers.ZeroAddress,
          amount,
          deadline
        )
      )
        .to.emit(paymentFacilitator, "PaymentRequestCreated")
        .withArgs(
          (requestId) => requestId !== null,
          recipient.address,
          ethers.ZeroAddress,
          amount,
          agent.address
        );
    });

    it("Should reject payment request from unauthorized agent", async function () {
      const unauthorizedAgent = (await ethers.getSigners())[3];
      const amount = ethers.parseEther("1.0");
      const deadline = Math.floor(Date.now() / 1000) + 3600;

      await expect(
        paymentFacilitator.connect(unauthorizedAgent).createPaymentRequest(
          recipient.address,
          ethers.ZeroAddress,
          amount,
          deadline
        )
      ).to.be.revertedWith("X402: Unauthorized agent");
    });
  });

  describe("Payment Execution", function () {
    let requestId;

    beforeEach(async function () {
      const amount = ethers.parseEther("1.0");
      const deadline = Math.floor(Date.now() / 1000) + 3600;

      const tx = await paymentFacilitator.connect(agent).createPaymentRequest(
        recipient.address,
        ethers.ZeroAddress,
        amount,
        deadline
      );

      const receipt = await tx.wait();
      const event = receipt.logs.find(
        (log) => log.topics[0] === paymentFacilitator.interface.getEvent("PaymentRequestCreated").topicHash
      );
      requestId = event.topics[1];
    });

    it("Should execute native CRO payment", async function () {
      const amount = ethers.parseEther("1.0");
      const recipientBalanceBefore = await ethers.provider.getBalance(recipient.address);

      await expect(
        paymentFacilitator.connect(owner).executePayment(requestId, { value: amount })
      )
        .to.emit(paymentFacilitator, "PaymentExecuted")
        .withArgs(
          requestId,
          recipient.address,
          ethers.ZeroAddress,
          amount,
          agent.address
        );

      const recipientBalanceAfter = await ethers.provider.getBalance(recipient.address);
      expect(recipientBalanceAfter - recipientBalanceBefore).to.equal(amount);
    });

    it("Should reject execution with insufficient funds", async function () {
      const insufficientAmount = ethers.parseEther("0.5");

      await expect(
        paymentFacilitator.connect(owner).executePayment(requestId, { value: insufficientAmount })
      ).to.be.revertedWith("X402: Insufficient CRO");
    });
  });
});

