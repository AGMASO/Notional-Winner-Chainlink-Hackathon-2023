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
  const args = [
    "0x4C65cED1a185Ff79313F00A9C9D3f52D0dC7c4B2",
    "0x4B0c5eb9d76c9b99372064c74643ad910DCdF8d4",
    "1234",
    "notional",
  ];
  const value = ethers.utils.parseEther("0.01");
  const escrow = await deploy("Escrow", {
    from: deployer,
    args: args,
    value: value,
    log: true,
    waitConfirmations: waitBlockConfirmations,
    gasPrice: 8000000000, // set gas price for Polygon
    gasLimit: 4000000, // set gas limit for Polygon
    chainId: 80001, // set chain ID for Polygon Mumbai
    nonce: 0, // set nonce for transaction
    network: "matic", // use the matic network
  });

  if (
    !developmentChain.includes(network.name) &&
    process.env.POLYGONSCAN_API_KEY
  ) {
    log("Verifying...");

    await verify(escrow.address, args);
  }
  console.log("----------------------------------------------------");
};

module.exports.tags = ["all", "escrow"];
