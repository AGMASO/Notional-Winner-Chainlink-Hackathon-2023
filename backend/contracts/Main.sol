// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "./Escrow.sol";

contract Main {
    //Initalize Escrow Contract
    Escrow public escrowInitialized;
    //Structs for each new EscrowContract
    struct Escrow_info {
        address escrowContract;
        string ownerUserName;
        string issueId;
        string repo;
        string url;
    }

    //Struct for each new Developer who wants to use our Service
    struct Developer_info {
        address developerAddress;
        string loginName;
    }

    mapping(address => bool) public EscrowExists;
    //Array of all the Escrow Structs
    Escrow_info[] public Escrows;
    //Array of all the Developer Structs
    Developer_info[] public Developers;

    address public consumerAddress;

    //Event fired when a new Escrow/bounty is created
    event EscrowCreated(
        address indexed escrowContract,
        address indexed arbiter,
        address indexed depositor,
        uint256 amount,
        string ownerUserName,
        string issueId,
        string repo,
        string url
    );
    event EscrowClosed(address indexed escrowContract, string issueId);
    event EscrowClosedAfterApprove(
        address indexed escrowContract,
        string issueId
    );

    //Event fired when a new Developer signIn
    event NewDeveloper(address indexed developer, string loginName);

    constructor(address escrowContractAddress) {
        // Initialize the Escrow contract
        escrowInitialized = Escrow(escrowContractAddress);
    }

    function setEscrowAddress(address escrowContractAddress) internal {
        escrowInitialized = Escrow(escrowContractAddress);
    }

    /**
     *
     * @param _developer address of the developer. We get this from wallet
     * @param _loginName loginName formGithub, we get this from singIn SSO
     */
    function addDeveloper(address _developer, string memory _loginName) public {
        Developers.push(Developer_info(_developer, _loginName));
        emit NewDeveloper(_developer, _loginName);
    }

    /**
     *
     *  @param _arbiter address of the arbiter who can apporve the payment
     *  @param _ownerUserName string with the name of the owner of the issue/repo
     *  @param _issueId uint256 with the numeric Id of the issue
     */

    function createEscrow(
        address _arbiter,
        string memory _ownerUserName,
        string memory _issueId,
        string memory _repo,
        string memory _url
    ) public payable {
        Escrow newEscrow = new Escrow{value: msg.value}(
            _arbiter,
            consumerAddress,
            _issueId,
            _repo
        );

        Escrows.push(
            Escrow_info(
                address(newEscrow),
                _ownerUserName,
                _issueId,
                _repo,
                _url
            )
        );

        EscrowExists[address(newEscrow)] = true;

        emit EscrowCreated(
            address(newEscrow),
            _arbiter,
            msg.sender,
            msg.value,
            _ownerUserName,
            _issueId,
            _repo,
            _url
        );
    }

    function createEscrowPreset() public payable {
        // TESTING PURPOSES ONLY, REMOVE FOR PROD
        Escrow newEscrow = new Escrow{value: msg.value}(
            address(0xa92370Db81cD337d1d1b7B07DA2839c2Fbf88d09),
            consumerAddress,
            "777",
            "notional"
        );
        Escrows.push(
            Escrow_info(
                address(newEscrow),
                "testName",
                "777",
                "notional",
                "https://github.com/Chusynuk"
            )
        );

        EscrowExists[address(newEscrow)] = true;

        emit EscrowCreated(
            address(newEscrow),
            0xa92370Db81cD337d1d1b7B07DA2839c2Fbf88d09,
            msg.sender,
            msg.value,
            "testName",
            "777",
            "notional",
            "https://github.com/Chusynuk/notional"
        );
    }

    function setConsumerAddress(address _consumerAddress) public {
        consumerAddress = _consumerAddress;
    }

    function isEscrow(address _contractAddress) public view returns (bool) {
        return EscrowExists[_contractAddress];
    }

    function EscrowsIsEmpty() public view returns (bool) {
        // TESTING PURPOSES ONLY, REMOVE FOR PROD
        if (Escrows.length == 0) {
            return true;
        }
        return false;
    }

    /**
     *
     * @param escrowContractAddress address from escrow contract that we want to delete
     */
    function deleteEscrowArray(
        address escrowContractAddress
    ) external returns (uint256) {
        setEscrowAddress(escrowContractAddress);
        uint256 arrayLength = Escrows.length;

        if (arrayLength == 0) {
            revert("No escrows found");
        }
        for (uint256 i = 0; i < arrayLength; i++) {
            if (Escrows[i].escrowContract == escrowContractAddress) {
                if (i < arrayLength - 1) {
                    Escrows[i] = Escrows[arrayLength - 1];
                }
                emit EscrowClosed(escrowContractAddress, Escrows[i].issueId);
                Escrows.pop();

                escrowInitialized.cancelEscrow(msg.sender);
                return i;
            }
        }
        revert("Escrow contract not found");
    }

    /**
     *
     * @param escrowContractAddress address of the escrow contract that we want to approve
     * @param beneficiary who get the money after approve
     */
    function ApproveEscrow(
        address escrowContractAddress,
        address beneficiary
    ) external returns (uint256) {
        setEscrowAddress(escrowContractAddress);
        uint256 arrayLength = Escrows.length;

        if (arrayLength == 0) {
            revert("No escrows found");
        }
        for (uint256 i = 0; i < arrayLength; i++) {
            if (Escrows[i].escrowContract == escrowContractAddress) {
                if (i < arrayLength - 1) {
                    Escrows[i] = Escrows[arrayLength - 1];
                }
                emit EscrowClosedAfterApprove(
                    escrowContractAddress,
                    Escrows[i].issueId
                );
                Escrows.pop();

                escrowInitialized.approve(beneficiary);
                return i;
            }
        }
        revert("Escrow contract not found");
    }

    function getEscrows() public view returns (Escrow_info[] memory) {
        return Escrows;
    }

    function getDevelopers() public view returns (Developer_info[] memory) {
        return Developers;
    }
}
