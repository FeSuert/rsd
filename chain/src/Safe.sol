// SPDX-License-Identifier: AGPL-3.0-only
pragma solidity ^0.8.10;

contract Safe {
    error InvalidSignatures();
    error ExecutionFailed();

    event QuorumUpdated(uint256 newQuorum);
    event Executed(address target, uint256 value, bytes payload);
    event SignerUpdated(address indexed signer, bool shouldTrust);

    struct Signature {
        uint8 v;
        bytes32 r;
        bytes32 s;
    }

    uint256 public nonce = 1;
    uint256 public quorum;
    bytes32 public immutable domainSeparator;
    uint256 public received;

    mapping(address => bool) public isSigner;

    bytes32 public constant QUORUM_HASH =
        keccak256("UpdateQuorum(uint256 newQuorum,uint256 nonce)");

    bytes32 public constant SIGNER_HASH =
        keccak256(
            "UpdateSigner(address signer,bool shouldTrust,uint256 nonce)"
        );

    bytes32 public constant EXECUTE_HASH =
        keccak256(
            "Execute(address target,uint256 value,bytes payload,uint256 nonce)"
        );

    address[] private walletOwners;
    string public name;

    constructor(
        string memory _name,
        address[] memory _signers,
        uint256 _quorum
    ) payable {
        unchecked {
            for (uint256 i = 0; i < _signers.length; i++)
                isSigner[_signers[i]] = true;
        }

        quorum = _quorum;
        walletOwners = _signers;
        name = _name;

        domainSeparator = keccak256(
            abi.encode(
                keccak256(
                    "EIP712Domain(string name,string version,uint256 chainId,address verifyingContract)"
                ),
                keccak256(bytes(_name)),
                keccak256(bytes("1")),
                block.chainid,
                address(this)
            )
        );
    }

    function execute(
        address target,
        uint256 value,
        bytes calldata payload,
        Signature[] calldata sigs
    ) public payable {
        bytes32 digest = keccak256(
            abi.encodePacked(
                "\x19\x01",
                domainSeparator,
                keccak256(
                    abi.encode(EXECUTE_HASH, target, value, payload, nonce++)
                )
            )
        );

        address previous;

        unchecked {
            for (uint256 i = 0; i < quorum; i++) {
                address sigAddress = ecrecover(
                    digest,
                    sigs[i].v,
                    sigs[i].r,
                    sigs[i].s
                );

                if (!isSigner[sigAddress] || previous >= sigAddress)
                    revert InvalidSignatures();

                previous = sigAddress;
            }
        }

        emit Executed(target, value, payload);

        (bool success, ) = target.call{value: value}(payload);

        if (!success) revert ExecutionFailed();
    }

    function setQuorum(
        uint256 _quorum,
        Signature[] calldata sigs
    ) public payable {
        bytes32 digest = keccak256(
            abi.encodePacked(
                "\x19\x01",
                domainSeparator,
                keccak256(abi.encode(QUORUM_HASH, _quorum, nonce++))
            )
        );

        address previous;

        unchecked {
            for (uint256 i = 0; i < quorum; i++) {
                address sigAddress = ecrecover(
                    digest,
                    sigs[i].v,
                    sigs[i].r,
                    sigs[i].s
                );

                if (!isSigner[sigAddress] || previous >= sigAddress)
                    revert InvalidSignatures();

                previous = sigAddress;
            }
        }

        emit QuorumUpdated(_quorum);

        quorum = _quorum;
    }

    function setSigner(
        address signer,
        bool shouldTrust,
        Signature[] calldata sigs
    ) public payable {
        bytes32 digest = keccak256(
            abi.encodePacked(
                "\x19\x01",
                domainSeparator,
                keccak256(abi.encode(SIGNER_HASH, signer, shouldTrust, nonce++))
            )
        );

        address previous;

        unchecked {
            for (uint256 i = 0; i < quorum; i++) {
                address sigAddress = ecrecover(
                    digest,
                    sigs[i].v,
                    sigs[i].r,
                    sigs[i].s
                );

                if (!isSigner[sigAddress] || previous >= sigAddress)
                    revert InvalidSignatures();

                previous = sigAddress;
            }
        }

        emit SignerUpdated(signer, shouldTrust);

        isSigner[signer] = shouldTrust;
    }

    function getOwners() public view returns (address[] memory) {
        return walletOwners;
    }

    function getMessageHash(
        bytes32 _funcSignatureHash,
        address _target,
        uint256 _amount,
        bytes calldata _payload
    ) public view returns (bytes32) {
        return keccak256(abi.encodePacked(_funcSignatureHash, _target, _amount, _payload, nonce));
    }

    // ---

    function executeTest(
        address target,
        uint256 value,
        bytes calldata payload,
        Signature[] calldata sigs
    ) public payable {
        bytes32 digest = keccak256(
            abi.encodePacked(
                "\x19Ethereum Signed Message:\n32",
                keccak256(
                    abi.encodePacked(EXECUTE_HASH, target, value, payload, nonce++)
                )
            )
        );

        address sigAddress = ecrecover(
            digest,
            sigs[0].v,
            sigs[0].r,
            sigs[0].s
        );

        if (isSigner[sigAddress]) {
            (bool success, ) = target.call{value: value}(payload);
        } else {
            revert(">>> wrong address");
        }

    }

    function test(string memory _msg, Signature memory sig) public pure returns (address) {
        bytes32 h = keccak256(abi.encodePacked("\x19Ethereum Signed Message:\n32", keccak256(abi.encodePacked(_msg))));
        address res = ecrecover(h, sig.v, sig.r, sig.s);
        return res;
    }

    receive() external payable {}
}
