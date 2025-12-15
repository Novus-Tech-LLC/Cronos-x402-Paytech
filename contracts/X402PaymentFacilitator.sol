// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";

/**
 * @title X402PaymentFacilitator
 * @dev Facilitates x402-compatible payments on Cronos EVM
 * Implements agent-triggered payment flows with programmable settlement
 */
contract X402PaymentFacilitator is Ownable, ReentrancyGuard {
    struct PaymentRequest {
        address recipient;
        address token; // address(0) for native CRO
        uint256 amount;
        bytes32 requestId;
        uint256 deadline;
        bool executed;
        address agent; // AI agent that triggered the payment
    }

    mapping(bytes32 => PaymentRequest) public paymentRequests;
    mapping(address => bool) public authorizedAgents;
    
    event PaymentRequestCreated(
        bytes32 indexed requestId,
        address indexed recipient,
        address indexed token,
        uint256 amount,
        address agent
    );
    
    event PaymentExecuted(
        bytes32 indexed requestId,
        address indexed recipient,
        address indexed token,
        uint256 amount,
        address agent
    );
    
    event AgentAuthorized(address indexed agent);
    event AgentRevoked(address indexed agent);

    modifier onlyAuthorizedAgent() {
        require(authorizedAgents[msg.sender], "X402: Unauthorized agent");
        _;
    }

    constructor() Ownable(msg.sender) {}

    /**
     * @dev Authorize an AI agent to trigger payments
     */
    function authorizeAgent(address agent) external onlyOwner {
        authorizedAgents[agent] = true;
        emit AgentAuthorized(agent);
    }

    /**
     * @dev Revoke authorization from an AI agent
     */
    function revokeAgent(address agent) external onlyOwner {
        authorizedAgents[agent] = false;
        emit AgentRevoked(agent);
    }

    /**
     * @dev Create a payment request (x402-compatible)
     * @param recipient Address to receive the payment
     * @param token Token address (address(0) for native CRO)
     * @param amount Amount to transfer
     * @param deadline Timestamp after which request expires
     * @return requestId Unique identifier for the payment request
     */
    function createPaymentRequest(
        address recipient,
        address token,
        uint256 amount,
        uint256 deadline
    ) external onlyAuthorizedAgent nonReentrant returns (bytes32) {
        require(recipient != address(0), "X402: Invalid recipient");
        require(amount > 0, "X402: Invalid amount");
        require(deadline > block.timestamp, "X402: Invalid deadline");

        bytes32 requestId = keccak256(
            abi.encodePacked(
                msg.sender,
                recipient,
                token,
                amount,
                deadline,
                block.timestamp
            )
        );

        paymentRequests[requestId] = PaymentRequest({
            recipient: recipient,
            token: token,
            amount: amount,
            requestId: requestId,
            deadline: deadline,
            executed: false,
            agent: msg.sender
        });

        emit PaymentRequestCreated(requestId, recipient, token, amount, msg.sender);
        return requestId;
    }

    /**
     * @dev Execute a payment request
     * @param requestId The payment request identifier
     */
    function executePayment(bytes32 requestId) external payable nonReentrant {
        PaymentRequest storage request = paymentRequests[requestId];
        
        require(request.recipient != address(0), "X402: Request not found");
        require(!request.executed, "X402: Already executed");
        require(block.timestamp <= request.deadline, "X402: Request expired");

        request.executed = true;

        if (request.token == address(0)) {
            // Native CRO payment
            require(msg.value >= request.amount, "X402: Insufficient CRO");
            (bool success, ) = request.recipient.call{value: request.amount}("");
            require(success, "X402: Transfer failed");
            
            // Refund excess
            if (msg.value > request.amount) {
                (success, ) = msg.sender.call{value: msg.value - request.amount}("");
                require(success, "X402: Refund failed");
            }
        } else {
            // ERC20 token payment
            require(msg.value == 0, "X402: No native token needed");
            IERC20 token = IERC20(request.token);
            require(
                token.transferFrom(msg.sender, request.recipient, request.amount),
                "X402: Token transfer failed"
            );
        }

        emit PaymentExecuted(
            requestId,
            request.recipient,
            request.token,
            request.amount,
            request.agent
        );
    }

    /**
     * @dev Batch execute multiple payment requests
     */
    function batchExecutePayments(bytes32[] calldata requestIds) external payable nonReentrant {
        uint256 totalNative = 0;
        
        for (uint256 i = 0; i < requestIds.length; i++) {
            PaymentRequest storage request = paymentRequests[requestIds[i]];
            
            require(request.recipient != address(0), "X402: Request not found");
            require(!request.executed, "X402: Already executed");
            require(block.timestamp <= request.deadline, "X402: Request expired");

            request.executed = true;

            if (request.token == address(0)) {
                totalNative += request.amount;
                (bool success, ) = request.recipient.call{value: request.amount}("");
                require(success, "X402: Transfer failed");
            } else {
                IERC20 token = IERC20(request.token);
                require(
                    token.transferFrom(msg.sender, request.recipient, request.amount),
                    "X402: Token transfer failed"
                );
            }

            emit PaymentExecuted(
                requestIds[i],
                request.recipient,
                request.token,
                request.amount,
                request.agent
            );
        }

        require(msg.value >= totalNative, "X402: Insufficient CRO");
        
        // Refund excess
        if (msg.value > totalNative) {
            (bool success, ) = msg.sender.call{value: msg.value - totalNative}("");
            require(success, "X402: Refund failed");
        }
    }

    /**
     * @dev Get payment request details
     */
    function getPaymentRequest(bytes32 requestId)
        external
        view
        returns (
            address recipient,
            address token,
            uint256 amount,
            uint256 deadline,
            bool executed,
            address agent
        )
    {
        PaymentRequest memory request = paymentRequests[requestId];
        return (
            request.recipient,
            request.token,
            request.amount,
            request.deadline,
            request.executed,
            request.agent
        );
    }

    /**
     * @dev Emergency withdraw (owner only)
     */
    function emergencyWithdraw() external onlyOwner {
        (bool success, ) = owner().call{value: address(this).balance}("");
        require(success, "X402: Withdraw failed");
    }
}

