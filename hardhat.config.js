// hardhat.config.js
require("@nomicfoundation/hardhat-toolbox");
require("dotenv").config();

module.exports = {
  solidity: {
    compilers: [
      {
        version: "0.8.0",
      },
      {
        version: "0.7.5",
      },
    ],
  },
  networks: {
    localhost: {
      url: "http://127.0.0.1:8545",
    },
    sepolia: {
      url: process.env.API_URL,
      accounts: [process.env.PRIVATE_KEY],
    },
    mainnet: {
      url: process.env.MAINNET_RPC_URL,
      accounts: [process.env.PRIVATE_KEY],
    },
    buildbear: {
      url: process.env.BUILDBEAR_URL, 
      accounts: [process.env.PRIVATE_KEY], 
    },
  },
};