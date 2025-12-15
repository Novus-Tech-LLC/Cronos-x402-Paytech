// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

/**
 * @title IX402Facilitator
 * @dev Interface for x402-compatible payment facilitation
 * This interface aligns with Cronos x402 facilitator standards
 */
interface IX402Facilitator {
    /**
     * @dev Creates a payment request compatible with x402 protocol
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
    ) external returns (bytes32 requestId);

    /**
     * @dev Executes a payment request
     * @param requestId The payment request identifier
     */
    function executePayment(bytes32 requestId) external payable;

    /**
     * @dev Gets payment request details
     * @param requestId The payment request identifier
     * @return recipient Recipient address
     * @return token Token address
     * @return amount Payment amount
     * @return deadline Expiration timestamp
     * @return executed Execution status
     * @return agent Agent that created the request
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
        );
}

