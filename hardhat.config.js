require("@nomiclabs/hardhat-ethers");
require("dotenv").config();

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: "0.8.20",
  networks: {
    amoy: {
      url: process.env.AMOY_RPC_URL || "https://polygon-amoy.drpc.org",
      accounts: process.env.DEPLOYER_PRIVATE_KEY ? [process.env.DEPLOYER_PRIVATE_KEY] : [],
      chainId: 80002
    },
    localhost: {
      url: process.env.LOCAL_RPC_URL,
      chainId: 31337
    },
    hardhat: {
      chainId: 1337
    }
  }
};