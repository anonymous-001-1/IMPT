/** @type import('hardhat/config').HardhatUserConfig */
require("@nomicfoundation/hardhat-network-helpers")
require("@nomicfoundation/hardhat-chai-matchers");
require("@nomiclabs/hardhat-ethers");
require("solidity-coverage");
require('dotenv').config()
const { GOERLI_RPC_URI, PRIVATE_KEY } = process.env
module.exports = {
  solidity: "0.8.12",
  defaultNetwork: "hardhat",
  networks: {
    goerli: {
      url: GOERLI_RPC_URI,
      accounts: [PRIVATE_KEY] 
    }
  }
};
