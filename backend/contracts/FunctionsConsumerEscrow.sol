// SPDX-License-Identifier: MIT
pragma solidity ^0.8.7;

import {Functions, FunctionsClient} from "./dev/functions/FunctionsClient.sol";
// import "@chainlink/contracts/src/v0.8/dev/functions/FunctionsClient.sol"; // Once published
import {ConfirmedOwner} from "@chainlink/contracts/src/v0.8/ConfirmedOwner.sol";

import "./Main.sol"; 

/**
 * @title Functions Consumer contract
 * @notice This contract is a demonstration of using Functions.
 * @notice NOT FOR PRODUCTION USE
 */
contract FunctionsConsumerEscrow is FunctionsClient, ConfirmedOwner {
    using Functions for Functions.Request;

    bytes32 public latestRequestId;
    bytes public latestResponse;
    bytes public latestError;

    string public Author_UserRepoIssue;
    string public testvar;
    //-----------------------------
    address public depositor;
    address public beneficiary;
    //-----------------------------
    Main main;
    string public source_store;
    bytes public secrets_store;
    string[] public args_store;
    uint64 public subscriptionId_store;
    uint32 public gasLimit_store;
    //-----------------------------
    bool public isApproved = false;
    uint public amount;
    //-----------------------------
    string public latestName;

    struct taskInfo {
        bool status;
        string author;
    }
    taskInfo[] public results;

    event OCRResponse(bytes32 indexed requestId, bytes result, bytes err);
    //-------------------------------------
    event Approved(uint256 balance);
    //----------------
    event ResultCF(string name);

    /**
     * @notice Executes once when a contract is created to initialize state variables
     *
     * @param oracle - The FunctionsOracle contract
     */
    // https://github.com/protofire/solhint/issues/242
    // solhint-disable-next-line no-empty-blocks
    constructor(
        address oracle,
        address _mainAddress,
        string memory _source
    ) payable FunctionsClient(oracle) ConfirmedOwner(msg.sender) {
        main = Main(_mainAddress);
        source_store = _source;
        depositor = msg.sender;
        amount = msg.value;
        setOracle(oracle);
    }

    modifier onlyEscrow {
        require(main.isEscrow(msg.sender));
        _;
    }
    /**
     * @notice Send a simple request
     *
     * @param source JavaScript source code
     * @param secrets Encrypted secrets payload
     * @param args List of arguments accessible from within the source code
     * @param subscriptionId Funtions billing subscription ID
     * @param gasLimit Maximum amount of gas used to call the client contract's `handleOracleFulfillment` function
     * @return Functions request ID
     */
    function executeRequest(
        string memory source,
        bytes memory secrets,
        string[] memory args,
        uint64 subscriptionId,
        uint32 gasLimit
    ) public returns (bytes32) {
        testvar = "TEST_STRING";
        Functions.Request memory req;
        req.initializeRequest(
            Functions.Location.Inline,
            Functions.CodeLanguage.JavaScript,
            source
        );
        //if (secrets.length > 0) {
        //    req.addRemoteSecrets(secrets);
        //}
        //if (args.length > 0) req.addArgs(args);

        bytes32 assignedReqID = sendRequest(req, subscriptionId, gasLimit);
        latestRequestId = assignedReqID;
        return assignedReqID;
    }

    function executeRequest2() public returns (bytes32) {
        Functions.Request memory req;
        req.initializeRequest(
            Functions.Location.Inline,
            Functions.CodeLanguage.JavaScript,
            source_store
        );

        req.addRemoteSecrets(secrets_store);
        req.addArgs(args_store);

        uint32 gasLimit = 300000;
        bytes32 assignedReqID = sendRequest(req, subscriptionId_store, gasLimit);
        latestRequestId = assignedReqID;
        return assignedReqID;
    }

    function executeRequest3(string[] calldata args) public returns (bytes32) {
        Functions.Request memory req;
        req.initializeRequest(
            Functions.Location.Inline,
            Functions.CodeLanguage.JavaScript,
            source_store
        );

        req.addRemoteSecrets(secrets_store);
        req.addArgs(args_store);

        uint32 gasLimit = 300000;
        bytes32 assignedReqID = sendRequest(req, subscriptionId_store, gasLimit);
        latestRequestId = assignedReqID;
        return assignedReqID;
    }

    /**
     * @notice Callback that is invoked once the DON has resolved the request or hit an error
     *
     * @param requestId The request ID, returned by sendRequest()
     * @param response Aggregated response from the user code
     * @param err Aggregated error from the user code or from the execution pipeline
     * Either response or error parameter will be set, but never both
     */
    function fulfillRequest(
        bytes32 requestId,
        bytes memory response,
        bytes memory err
    ) internal override {
        latestResponse = response;
        latestError = err;
        //----------------------
        //bool approved = functionResult.status; 
        //string author = functionResult.author; 
        //results(19) = taskInfo(approved, author)
        //latestName = string(abi.encodePacked(response));
        // (string memory s1, string memory s2) = abi.decode(data, (string, string))

        //bool nilErr = (err.length == 0);
        //if (nilErr) {
        //(string memory author, string memory userRepoIssue) = abi.decode(response, (string, string));
            //string memory _Author_UserRepoIssue = string(abi.encodePacked(response));
            //Author_UserRepoIssue = _Author_UserRepoIssue;
        //}

        

        emit OCRResponse(requestId, response, err);
        //---------------------------------------
        //emit ResultCF(latestName);
    }

    /**
     * @notice Allows the Functions oracle address to be updated
     *
     * @param oracle New oracle address
     */
    function updateOracleAddress(address oracle) public onlyOwner {
        setOracle(oracle);
    }

    function addSimulatedRequestId(
        address oracleAddress,
        bytes32 requestId
    ) public onlyOwner {
        addExternalRequest(oracleAddress, requestId);
    }

    function executeRequestFromEscrow(string[] memory args) public returns (bytes32) {
        string memory source = source_store;
        bytes memory secrets = abi.encode(" ");
        //string[] memory args = args_store;
        //testvar = "TEST_STRING";
        uint32 gasLimit = 300000;
        return executeRequest(
            source,
            secrets,
            args,
            subscriptionId_store,
            gasLimit
        );
    }

    function setSubscriptionId(uint64 _subId) public {
        subscriptionId_store = _subId;
    }
    /**
     * @notice Function of the Excrow Contract to approve the payment after PR
     *
     
    function approve(address _beneficiary) public payable {
        require(msg.sender == arbiter, "Only arbiter can approve");
        //We implement Chainlink Functions to fetch the info of developer
        //who resolved the issue succesfully

        isApproved = true;
        beneficiary = _beneficiary;
        (bool sent, ) = beneficiary.call{value: amount}("");
        require(sent, "Failed to send Ether");

        emit Approved(amount);
    }
    */
}
