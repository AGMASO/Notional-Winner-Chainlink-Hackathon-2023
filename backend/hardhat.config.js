require("@nomiclabs/hardhat-etherscan");
require("hardhat-deploy");
require("solidity-coverage");
require("hardhat-gas-reporter");
//require("dotenv").config();
require("@nomiclabs/hardhat-waffle");
require("@chainlink/env-enc").config()
/** @type import('hardhat/config').HardhatUserConfig */

const PRIVATE_KEY = process.env.PRIVATE_KEY;
const POLYGON_MUMBAI_RPC_URL = process.env.POLYGON_MUMBAI_RPC_URL;
const POLYGONSCAN_API_KEY = process.env.POLYGONSCAN_API_KEY;

module.exports = {
  solidity: {
    compilers: [
      {
        version: "0.8.9",
      },
      {
        version: "0.4.24",
      },
      {
        version: "0.6.12",
      },
      {
        version: "0.4.19",
      },
      {
        version: "0.6.6",
      },
      {
        version: "0.7.6",
      },
    ],
  },

  defaultNetwork: "polygonMumbai",

  networks: {
    localhost: {
      chainId: 31337,
      allowUnlimitedContractSize: true,
    },
    polygonMumbai: {
      url: POLYGON_MUMBAI_RPC_URL,
      accounts: [PRIVATE_KEY],
      chainId: 80001,
      blockConfirmation: 6,
      allowUnlimitedContractSize: true,
    }
  },

  etherscan: {
    apiKey: POLYGONSCAN_API_KEY, 
  },

  namedAccounts: {
    deployer: {
      default: 0,
    },
    player: {
      default: 1,
    },
  },
  mocha: {
    timeout: 500000, // 500 seconds max for running tests
  },
  plugins: ["hardhat-deploy"],
};
