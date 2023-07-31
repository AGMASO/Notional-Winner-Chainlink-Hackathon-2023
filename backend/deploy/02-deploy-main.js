const {
  developmentChain,
  VERIFICATION_BLOCK_CONFIRMATIONS,
} = require("../helper-hardhat-config");

const { network, ethers } = require("hardhat");
const { verify } = require("../utils/verify");

module.exports = async ({ getNamedAccounts, deployments }) => {
  const { deploy, log } = deployments;
  const { deployer } = await getNamedAccounts();

  const waitBlockConfirmations = developmentChain.includes(network.name)
    ? 1
    : VERIFICATION_BLOCK_CONFIRMATIONS;

  console.log("----------------------------------------------------");

  const main = await deploy("Main", {
    from: deployer,
    args: ["0xe1C3252461D687e9beb75c9384A35e07B3C99978"],
    log: true,
    waitConfirmations: waitBlockConfirmations,
    gasPrice: 8000000000, // set gas price for Polygon
    gasLimit: 4000000, // set gas limit for Polygon
    chainId: 80001, // set chain ID for Polygon Mumbai
    nonce: 0, // set nonce for transaction
    network: "polygonMumbai", // use the matic network
  });
  if (
    !developmentChain.includes(network.name) &&
    process.env.POLYGONSCAN_API_KEY
  ) {
    log("Verifying...");

    await verify(main.address, ["0xe1C3252461D687e9beb75c9384A35e07B3C99978"]);
  }
  console.log("----------------------------------------------------");
};

module.exports.tags = ["all", "escrow"];
