const knownContracts = require('./known-contracts');
const { socPools, POOL1_START_DATE } = require('./pools');

// Tokens
// deployed first
const Cash = artifacts.require('Cash');
const MockBUSD = artifacts.require('MockBUSD');

// ============ Main Migration ============
module.exports = async (deployer, network, accounts) => {
  for await (const { contractName, token } of socPools) {
    const tokenAddress = knownContracts[token][network] || MockBUSD.address;
    if (!tokenAddress) {
      // network is mainnet, so MockBUSD is not available
      throw new Error(`Address of ${token} is not registered on migrations/known-contracts.js!`);
    }

    const contract = artifacts.require(contractName);
    console.log("deploy " + contractName);
    await deployer.deploy(contract, Cash.address, tokenAddress, POOL1_START_DATE);
  }
};
