const hre = require("hardhat");
const fs = require('fs').promises;

async function main() {
    const [owner, otherAccount] = await ethers.getSigners();

    const mainResults = await deploy_main();
    const main = mainResults[0];
    const mainAddress = mainResults[1];

    const consumerResults = await deploy_consumer(mainAddress);
    const consumer = consumerResults[0];
    const consumerAddress = consumerResults[1];

    const subId = await createSubscription(consumerAddress);

    await consumer.setSubscriptionId(subId);

    await main.setConsumerAddress(consumerAddress);

    const escrow = await deploy_escrow(owner, main);

    await test_escrow(escrow);

    await test_consumer(consumer);


    await test_functions(consumer);
        /// Set consumer address in main
        /// Call CLfunctions via deployed consumer
        /// Call CLFunctions via one of the escrows
        /// See how to store values in consumer and get them to escrow, edit source script to return correct data


}

async function deploy_main() {
    // DEPLOY MAIN CONTRACT
    const Main = await hre.ethers.getContractFactory("Main");
	const main = await Main.deploy();
	await main.deployed();
	console.log("Main deployed to:", main.address);
    
    const mainAddress = ethers.utils.getAddress(main.address);

    return [main, mainAddress];
}

async function deploy_escrow(owner, main) {
    // Check if Escrows is empty
    const EscrowsIsEmpty1 = await main.EscrowsIsEmpty();
    console.log("EscrowsIsEmpty", EscrowsIsEmpty1);

    // Deploy Escrow via Main
    const result = await main.createEscrow(owner.address, "testName", "19", "notional");
    const receipt = await result.wait();
    //console.log(receipt);
    console.log("Escrow should now be created and present in Escrows");

    // Check if Escrows is empty
    const EscrowsIsEmpty2 = await main.EscrowsIsEmpty();
    console.log("EscrowsIsEmpty", EscrowsIsEmpty2);

    // Get address from the struct just added to Escrows
    const escrow = await main.Escrows(0);
    const escrowAddress = escrow.escrowContract;
    console.log("Escrow address is:", escrowAddress);

    // Check if isEscrow returns true for the address of the Escrow we just made, and false for a random address
    const EscrowIsEscrow = await main.isEscrow(escrowAddress);
    const OtherIsEscrow = await main.isEscrow("0xCC1ddA58ec286dbb5deA3D2B377A9cFcCF924a5a");
    console.log("EscrowIsEscrow", EscrowIsEscrow);
    console.log("OtherIsEscrow", OtherIsEscrow);

    //Attach Escrow contract to interact with Escrow methods
    const Escrow_contract = await hre.ethers.getContractFactory("Escrow");
	  const escrow_contract = await Escrow_contract.attach(escrowAddress);

    return escrow_contract;
}

async function test_escrow(escrow_contract) {

    const consumerAddressInEscrow = await escrow_contract.consumer();
    const depositor = await escrow_contract.depositor();
    const beneficiary = await escrow_contract.beneficiary();
    const arbiter = await escrow_contract.arbiter();
    const isApproved = await escrow_contract.isApproved();
    const amount = await escrow_contract.amount();
    const issueID = await escrow_contract.issueID();
    const repo = await escrow_contract.repo();

    console.log("\nEscrow contract variables:");
    console.log("consumer", consumerAddressInEscrow);
    console.log("depositor", depositor);
    console.log("beneficiary", beneficiary);
    console.log("arbiter", arbiter);
    console.log("isApproved", isApproved);
    console.log("amount", amount);
    console.log("issueID", issueID);
    console.log("repo", repo);

}

async function test_consumer(consumer_contract) {
  //console.log("FOUND");
  const latestRequestId = await consumer_contract.latestRequestId();
  const latestResponse = await consumer_contract.latestResponse();
  const latestError = await consumer_contract.latestError();
  //console.log("FOUND");
  //-----------------------------
  const depositor = await consumer_contract.depositor();
  const beneficiary = await consumer_contract.beneficiary();
  //console.log("FOUND");
  //-----------------------------
  const source_store = await consumer_contract.source_store();
  const secrets_store = await consumer_contract.secrets_store();
  const subscriptionId_store = await consumer_contract.subscriptionId_store();
  const gasLimit_store = await consumer_contract.gasLimit_store();
  //console.log("FOUND");
  //-----------------------------
  const isApproved = await consumer_contract.isApproved();
  const amount = await consumer_contract.amount();
  //console.log("FOUND");
  //-----------------------------
  const latestName = await consumer_contract.latestName();
  //console.log("FOUND");
  //const results = await consumer_contract.results();
  //console.log("FOUND");

  console.log("\nConsumer contract variables:");
  console.log("latestRequestId", latestRequestId);
  console.log("latestResponse", latestResponse);
  console.log("latestError", latestError);

  console.log("depositor", depositor);
  console.log("beneficiary", beneficiary);

  console.log("source_store", source_store);
  console.log("secrets_store", secrets_store);
  console.log("subscriptionId_store", subscriptionId_store);
  console.log("gasLimit_store", gasLimit_store);

  console.log("isApproved", isApproved);
  console.log("amount", amount);

  console.log("latestName", latestName);
  //console.log("results", results);

}

async function deploy_consumer(mainAddress) {
    // DEPLOY FUNCTION CONSUMER FOR ESCROWS TO INTERACT WITH

    //const mainAddress = ethers.utils.getAddress("0x47ba4b430f995c6d62793E9fBB25Bd4d0ff2259E");
    console.log(mainAddress);
    //!I have hardcoded the oracleAddress as is was not working with the Const name
    const oracleAddress = ethers.utils.getAddress("0xeA6721aC65BCeD841B8ec3fc5fEdeA6141a0aDE4"); //For Mumbai.No change if used Mumbai
    console.log(oracleAddress);
    
    // Set up source to be passed into Consumer constructor
    const sourcePath = './FR-source-GitHub.js'; // path to CLFunctions source file
    const source = await fs.readFile(sourcePath, "utf8");
  
    const [owner, otherAccount] = await ethers.getSigners();
    const provider = new ethers.providers.JsonRpcProvider(
      "https://polygon-mumbai.g.alchemy.com/v2/WGlYvVraJOmI2Fd18AXx-lJ_mxsISz0w"
    );
    const networkId = await provider.getNetwork();
    console.log("Network ID:", networkId.chainId);
    // Set your contract name.
    const contractName = "FunctionsConsumerEscrow";
    //const contractName = "MyFirstContract"
    // Set up the signer using your private key for the Polygon Mumbai network
  
    const [deployer] = await ethers.getSigners();
  
    console.log("Deploying contracts with the account:", deployer.address);
  
    console.log("Account balance:", (await deployer.getBalance()).toString());
  
    const Consumer = await ethers.getContractFactory(contractName);
    console.log("hey ya");
  
  
    // DEPLOY CONSUMER
    const consumer = await Consumer.deploy(
      oracleAddress, 
      mainAddress,
      `${source}`
      );
  
    console.log("Deployed Functions Consumer address:", consumer.address);

    return [consumer, consumer.address];
  }
  
  async function test_functions(consumer) {
    console.log("\nTesting Chainlink Functions");
    //await escrow.makeFunctionRequest();


    const latestRequestId1 = await consumer.latestRequestId();
    console.log(latestRequestId1);
    const latestResponse1 = await consumer.latestResponse();
    console.log(latestResponse1);
    const latestError1 = await consumer.latestError();
    console.log(latestError1);
    
    //const testvar1 = await consumer.testvar();
    //console.log("testvar", testvar1);

    const gasLimit = 300000; // Set your desired gas limit

    const args = ["notional", "19"];
    //const result = await consumer.executeRequestFromEscrow(args);
    //const result = await consumer.executeRequest2();
    const result = await consumer.executeRequest3(args);
    //const receipt = await result.wait(10);

    // Specify the gas limit in the transaction options
    const overrides = {
      gasLimit: gasLimit
    };
    
    await result.wait({ gasLimit: gasLimit });
    

    //console.log(result);
    console.log("\n\n");
    console.log(receipt);

    const latestRequestId2 = await consumer.latestRequestId();
    console.log(latestRequestId2);
    const latestResponse2 = await consumer.latestResponse();
    console.log(latestResponse2);
    const latestError2 = await consumer.latestError();
    console.log(latestError2);

    //const testvar2 = await consumer.testvar();
    //console.log("testvar", testvar2);


    const Author_UserRepoIssue = await consumer.Author_UserRepoIssue();
    console.log("Author_UserRepoIssue", Author_UserRepoIssue);

  }

  async function createSubscription(consumerAddress) {
    // 1 LINK is sufficient for this example
    const linkAmount = "5";
    // Set your consumer contract address. This contract will
    // be added as an approved consumer of the subscription.
    const consumer = consumerAddress;
  
    // Network-specific configs
    // Polygon Mumbai LINK 0x326C977E6efc84E512bB9C30f76E30c160eD06FB
    // See https://docs.chain.link/resources/link-token-contracts
    // to find the LINK token contract address for your network.
    const linkTokenAddress = "0x326C977E6efc84E512bB9C30f76E30c160eD06FB";
    // Polygon Mumbai billing registry: 0xEe9Bf52E5Ea228404bB54BCFbbDa8c21131b9039
    // See https://docs.chain.link/chainlink-functions/supported-networks
    // for a list of supported networks and registry addresses.
    const functionsBillingRegistryProxy =
      "0xEe9Bf52E5Ea228404bB54BCFbbDa8c21131b9039";
    const RegistryFactory = await ethers.getContractFactory(
      "contracts/dev/functions/FunctionsBillingRegistry.sol:FunctionsBillingRegistry"
    );
    const registry = await RegistryFactory.attach(functionsBillingRegistryProxy);
  
    const createSubscriptionTx = await registry.createSubscription();
    const createSubscriptionReceipt = await createSubscriptionTx.wait(1);
    const subscriptionId =
      createSubscriptionReceipt.events[0].args["subscriptionId"].toNumber();
    console.log(`Subscription created with ID: ${subscriptionId}`);
  
    //Get the amount to fund, and ensure the wallet has enough funds
    const juelsAmount = ethers.utils.parseUnits(linkAmount);
    const LinkTokenFactory = await ethers.getContractFactory("LinkToken");
    const linkToken = await LinkTokenFactory.attach(linkTokenAddress);
  
    const accounts = await ethers.getSigners();
    const signer = accounts[0];
  
    // Check for a sufficent LINK balance to fund the subscription
    const balance = await linkToken.balanceOf(signer.address);
    if (juelsAmount.gt(balance)) {
      throw Error(`Insufficent LINK balance`);
    }
  
    console.log(`Funding with ` + juelsAmount + ` Juels (1 LINK = 10^18 Juels)`);
    const fundTx = await linkToken.transferAndCall(
      functionsBillingRegistryProxy,
      juelsAmount,
      ethers.utils.defaultAbiCoder.encode(["uint64"], [subscriptionId])
    );
    await fundTx.wait(1);
    console.log(
      `Subscription ${subscriptionId} funded with ${juelsAmount} Juels (1 LINK = 10^18 Juels)`
    );
  
    //Authorize deployed contract to use new subscription
    console.log(
      `Adding consumer contract address ${consumer} to subscription ${subscriptionId}`
    );
    const addTx = await registry.addConsumer(subscriptionId, consumer);
    await addTx.wait(1);
    console.log(`Authorized consumer contract: ${consumer}`);

    return subscriptionId;
  }


  main()
    .then(() => process.exit(0))
    .catch((error) => {
      console.error(error);
      process.exit(1);
    });
  