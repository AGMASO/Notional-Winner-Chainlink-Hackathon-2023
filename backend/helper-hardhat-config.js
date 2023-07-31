//Helper file for hardhat-Config
//Only Polygon Mumbai version and local(if needed)

const { ethers } = require("hardhat");

const networkConfig = {
  31337: {
    name: "hardhat",
    ethUsdPriceFeed: "0x9326BFA02ADD2366b30bacB125260Af641031331",
    /*vrfCoordinatorV2: "",*/ //We don´t need it for local.
    mintFee: ethers.utils.parseEther("0.05"),
    vrfCoordinatorV2: "0x2ca8e0c643bde4c2e08ab1fa0da3401adad7734d",
    keyHash:
      "0x79d3d8832d904592c0bf9818b621522c988bb8b0c05cdc3b15aea1b6e8db0c15",
    subscriptionId: "4054",
    callbackGasLimit: "500000",
    interval: "30",
  },

  80001: {
    //Esto no esta adaptado totalment, REVISAR!!
    name: "polygonMumbai",
    vrfCoordinatorV2: "0x7a1BaC17Ccc5b313516C5E16fb24f7659aA5ebed",
    entranceFee: ethers.utils.parseEther("0.000002"),
    keyHash:
      "0x6e099d640cde6de9d40ac749b4b594126b0169747122711109c9985d47751f93",
    subscriptionId: "4054",
    callbackGasLimit: "500000",
    interval: "30",
  },
};

const VERIFICATION_BLOCK_CONFIRMATIONS = 6;

//Aqui vamos a especificar cual es nuestra developmentChain, es decir la que no tiene priceFeed,

const developmentChain = ["hardhat", "localhost"];

module.exports = {
  networkConfig,
  developmentChain,
  VERIFICATION_BLOCK_CONFIRMATIONS,
};
