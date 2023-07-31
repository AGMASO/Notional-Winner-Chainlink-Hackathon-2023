const fs = require("fs").promises
const { ethers } = require('hardhat');

async function main() {
  // The oracle address on Polygon Mumbai
  // See https://docs.chain.link/chainlink-functions/supported-networks
  // for a list of supported networks and addresses.


  const mainAddress = ethers.utils.getAddress("0x47ba4b430f995c6d62793E9fBB25Bd4d0ff2259E");
  console.log(mainAddress);
  //!I have hardcoded the oracleAddress as is was not working with the Const name
  const oracleAddress = ethers.utils.getAddress("0xeA6721aC65BCeD841B8ec3fc5fEdeA6141a0aDE4"); //For Mumbai.No change if used Mumbai
  console.log(oracleAddress);
  
  const source = await fs.readFile("./FR-source-GitHub.js", "utf8");

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

  const consumerContract = await ethers.getContractFactory(contractName);
  console.log("hey ya");


  // DEPLOY CONSUMER
  const deployedContract = await consumerContract.deploy(
    oracleAddress, 
    mainAddress,
    `${source}`
    );
  //const deployedContract = await consumerContract.connect(arbiter).deploy("0xeA6721aC65BCeD841B8ec3fc5fEdeA6141a0aDE4", arbiter);

  console.log("Deployed Functions Consumer address:", deployedContract.address);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
