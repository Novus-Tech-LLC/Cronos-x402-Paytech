// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "./X402PaymentFacilitator.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

/**
 * @title AgentPaymentManager
 * @dev Manages AI agent payment workflows and automations
 * Enables conditional payments, recurring payments, and multi-step settlement
 */
contract AgentPaymentManager is Ownable {
    X402PaymentFacilitator public paymentFacilitator;

    struct RecurringPayment {
        address recipient;
        address token;
        uint256 amount;
        uint256 interval; // seconds
        uint256 nextExecution;
        uint256 endDate;
        bool active;
        address agent;
    }

    struct ConditionalPayment {
        bytes32 paymentRequestId;
        bytes32 conditionHash;
        bool executed;
    }

    mapping(bytes32 => RecurringPayment) public recurringPayments;
    mapping(bytes32 => ConditionalPayment) public conditionalPayments;
    mapping(address => bytes32[]) public agentRecurringPayments;

    event RecurringPaymentCreated(
        bytes32 indexed paymentId,
        address indexed recipient,
        address indexed agent
    );
    
    event RecurringPaymentExecuted(
        bytes32 indexed paymentId,
        bytes32 indexed requestId
    );
    
    event ConditionalPaymentCreated(
        bytes32 indexed conditionId,
        bytes32 indexed paymentRequestId
    );
    
    event ConditionalPaymentExecuted(
        bytes32 indexed conditionId,
        bytes32 indexed paymentRequestId
    );

    constructor(address _paymentFacilitator) Ownable(msg.sender) {
        paymentFacilitator = X402PaymentFacilitator(_paymentFacilitator);
    }

    /**
     * @dev Create a recurring payment schedule
     */
    function createRecurringPayment(
        address recipient,
        address token,
        uint256 amount,
        uint256 interval,
        uint256 duration // total duration in seconds
    ) external returns (bytes32) {
        require(recipient != address(0), "AgentPayment: Invalid recipient");
        require(amount > 0, "AgentPayment: Invalid amount");
        require(interval > 0, "AgentPayment: Invalid interval");

        bytes32 paymentId = keccak256(
            abi.encodePacked(
                msg.sender,
                recipient,
                token,
                amount,
                interval,
                block.timestamp
            )
        );

        recurringPayments[paymentId] = RecurringPayment({
            recipient: recipient,
            token: token,
            amount: amount,
            interval: interval,
            nextExecution: block.timestamp + interval,
            endDate: block.timestamp + duration,
            active: true,
            agent: msg.sender
        });

        agentRecurringPayments[msg.sender].push(paymentId);

        emit RecurringPaymentCreated(paymentId, recipient, msg.sender);
        return paymentId;
    }

    /**
     * @dev Execute recurring payment if due
     */
    function executeRecurringPayment(bytes32 paymentId) external {
        RecurringPayment storage payment = recurringPayments[paymentId];
        
        require(payment.active, "AgentPayment: Not active");
        require(block.timestamp >= payment.nextExecution, "AgentPayment: Not due yet");
        require(block.timestamp <= payment.endDate, "AgentPayment: Expired");

        // Create payment request
        bytes32 requestId = paymentFacilitator.createPaymentRequest(
            payment.recipient,
            payment.token,
            payment.amount,
            block.timestamp + 1 hours
        );

        // Update next execution time
        payment.nextExecution = block.timestamp + payment.interval;
        
        // Deactivate if past end date
        if (payment.nextExecution > payment.endDate) {
            payment.active = false;
        }

        emit RecurringPaymentExecuted(paymentId, requestId);
    }

    /**
     * @dev Create a conditional payment
     */
    function createConditionalPayment(
        address recipient,
        address token,
        uint256 amount,
        bytes32 conditionHash
    ) external returns (bytes32) {
        bytes32 requestId = paymentFacilitator.createPaymentRequest(
            recipient,
            token,
            amount,
            block.timestamp + 30 days
        );

        bytes32 conditionId = keccak256(
            abi.encodePacked(requestId, conditionHash, block.timestamp)
        );

        conditionalPayments[conditionId] = ConditionalPayment({
            paymentRequestId: requestId,
            conditionHash: conditionHash,
            executed: false
        });

        emit ConditionalPaymentCreated(conditionId, requestId);
        return conditionId;
    }

    /**
     * @dev Execute conditional payment if condition is met
     */
    function executeConditionalPayment(
        bytes32 conditionId,
        bytes32 conditionProof
    ) external {
        ConditionalPayment storage conditional = conditionalPayments[conditionId];
        
        require(!conditional.executed, "AgentPayment: Already executed");
        require(
            keccak256(abi.encodePacked(conditionProof)) == conditional.conditionHash,
            "AgentPayment: Condition not met"
        );

        conditional.executed = true;
        emit ConditionalPaymentExecuted(conditionId, conditional.paymentRequestId);
    }

    /**
     * @dev Cancel a recurring payment
     */
    function cancelRecurringPayment(bytes32 paymentId) external {
        RecurringPayment storage payment = recurringPayments[paymentId];
        require(payment.agent == msg.sender || msg.sender == owner(), "AgentPayment: Unauthorized");
        payment.active = false;
    }

    /**
     * @dev Get all recurring payments for an agent
     */
    function getAgentRecurringPayments(address agent)
        external
        view
        returns (bytes32[] memory)
    {
        return agentRecurringPayments[agent];
    }
}

