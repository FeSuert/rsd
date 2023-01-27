// SPDX-License-Identifier: MIT
pragma solidity ^0.8.10;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract Superfluid {
    error Unauthorized();
    error StreamNotFound();
    error StreamStillActive();

    event StreamCreated(Stream stream);
    event StreamRefueled(uint256 indexed streamId, uint256 amount);
    event FundsWithdrawn(uint256 indexed streamId, uint256 amount);
    event ExcessWithdrawn(uint256 indexed streamId, uint256 amount);
    event StreamDetailsUpdated(
        uint256 indexed streamId,
        uint256 paymentPerBlock,
        Timeframe timeframe
    );

    struct Stream {
        address sender;
        address recipient;
        ERC20 token;
        uint256 balance;
        uint256 withdrawnBalance;
        uint256 paymentPerBlock;
        Timeframe timeframe;
    }

    struct Timeframe {
        uint256 startBlock;
        uint256 stopBlock;
    }

    struct Signature {
        uint8 v;
        bytes32 r;
        bytes32 s;
    }

    uint256 internal streamId = 1;
    uint256 public nonce = 1;
    bytes32 public immutable domainSeparator;
    bytes32 public constant UPDATE_DETAILS_HASH =
        keccak256(
            "UpdateStreamDetails(uint256 streamId,uint256 paymentPerBlock,uint256 startBlock,uint256 stopBlock,uint256 nonce)"
        );
    mapping(uint256 => Stream) public getStream;

    constructor() payable {
        domainSeparator = keccak256(
            abi.encode(
                keccak256(
                    "EIP712Domain(string name,string version,uint256 chainId,address verifyingContract)"
                ),
                keccak256(bytes("LilSuperfluid")),
                keccak256(bytes("1")),
                block.chainid,
                address(this)
            )
        );
    }

    function streamTo(
        address recipient,
        ERC20 token,
        uint256 initialBalance,
        Timeframe memory timeframe,
        uint256 paymentPerBlock
    ) external payable returns (uint256) {
        Stream memory stream = Stream({
            token: token,
            sender: msg.sender,
            withdrawnBalance: 0,
            timeframe: timeframe,
            recipient: recipient,
            balance: initialBalance,
            paymentPerBlock: paymentPerBlock
        });

        emit StreamCreated(stream);

        getStream[streamId] = stream;

        token.transferFrom(msg.sender, address(this), initialBalance);

        return streamId++;
    }

    function refuel(uint256 streamId, uint256 amount) public payable {
        if (getStream[streamId].sender != msg.sender) revert Unauthorized();

        unchecked {
            getStream[streamId].balance += amount;
        }

        emit StreamRefueled(streamId, amount);

        getStream[streamId].token.transferFrom(
            msg.sender,
            address(this),
            amount
        );
    }

    function withdraw(uint256 streamId) public payable {
        if (getStream[streamId].recipient != msg.sender) revert Unauthorized();

        uint256 balance = balanceOf(streamId, msg.sender);

        unchecked {
            getStream[streamId].withdrawnBalance += balance;
        }

        emit FundsWithdrawn(streamId, balance);

        getStream[streamId].token.transfer(msg.sender, balance);
    }

    function refund(uint256 streamId) public payable {
        if (getStream[streamId].sender != msg.sender) revert Unauthorized();
        if (getStream[streamId].timeframe.stopBlock > block.number)
            revert StreamStillActive();

        uint256 balance = balanceOf(streamId, msg.sender);

        getStream[streamId].balance -= balance;

        emit ExcessWithdrawn(streamId, balance);

        getStream[streamId].token.transfer(msg.sender, balance);
    }

    function calculateBlockDelta(
        Timeframe memory timeframe
    ) internal view returns (uint256 delta) {
        if (block.number <= timeframe.startBlock) return 0;
        if (block.number < timeframe.stopBlock)
            return block.number - timeframe.startBlock;

        return timeframe.stopBlock - timeframe.startBlock;
    }

    function balanceOf(
        uint256 streamId,
        address who
    ) public view returns (uint256) {
        Stream memory stream = getStream[streamId];

        if (stream.sender == address(0)) revert StreamNotFound();

        uint256 blockDelta = calculateBlockDelta(stream.timeframe);
        uint256 recipientBalance = blockDelta * stream.paymentPerBlock;

        if (who == stream.recipient)
            return recipientBalance - stream.withdrawnBalance;
        if (who == stream.sender) return stream.balance - recipientBalance;

        return 0;
    }

    function updateDetails(
        uint256 streamId,
        uint256 paymentPerBlock,
        Timeframe memory timeframe,
        Signature memory sig
    ) public payable {
        Stream memory stream = getStream[streamId];

        if (stream.sender == address(0)) revert StreamNotFound();

        bytes32 digest = keccak256(
            abi.encodePacked(
                "\x19\x01",
                domainSeparator,
                keccak256(
                    abi.encode(
                        UPDATE_DETAILS_HASH,
                        streamId,
                        paymentPerBlock,
                        timeframe.startBlock,
                        timeframe.stopBlock,
                        nonce++
                    )
                )
            )
        );

        address sigAddress = ecrecover(digest, sig.v, sig.r, sig.s);

        if (
            !(stream.sender == msg.sender && stream.recipient == sigAddress) &&
            !(stream.sender == sigAddress && stream.recipient == msg.sender)
        ) revert Unauthorized();

        emit StreamDetailsUpdated(streamId, paymentPerBlock, timeframe);

        getStream[streamId].paymentPerBlock = paymentPerBlock;
        getStream[streamId].timeframe = timeframe;
    }
}
