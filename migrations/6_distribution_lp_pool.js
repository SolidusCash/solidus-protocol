const knownContracts = require('./known-contracts');
const { POOL2_START_DATE } = require('./pools');

const Cash = artifacts.require('Cash');
const Share = artifacts.require('Share');
const Oracle = artifacts.require('Oracle');
const MockBUSD = artifacts.require('MockBUSD');
const IERC20 = artifacts.require('IERC20');

const BUSDBACLPToken_SOSPool = artifacts.require('BUSDSOCLPTokenSharePool')
const BUSDBASLPToken_SOSPool = artifacts.require('BUSDSOSLPTokenSharePool')

const UniswapV2Factory = artifacts.require('UniswapV2Factory');

module.exports = async (deployer, network, accounts) => {
  const uniswapFactory = ['dev'].includes(network)
    ? await UniswapV2Factory.deployed()
    : await UniswapV2Factory.at(knownContracts.UniswapV2Factory[network]);

    const busd = (network === 'bsc' || network === 'testnet') 
    ? await IERC20.at(knownContracts.BUSD[network])
    : await MockBUSD.deployed();

  const oracle = await Oracle.deployed();

  const busd_soc_lpt = await oracle.pairFor(uniswapFactory.address, Cash.address, busd.address);
  const busd_sos_lpt = await oracle.pairFor(uniswapFactory.address, Share.address, busd.address);

  await deployer.deploy(BUSDBACLPToken_SOSPool, Share.address, busd_soc_lpt, POOL2_START_DATE,accounts[0]);
  await deployer.deploy(BUSDBASLPToken_SOSPool, Share.address, busd_sos_lpt, POOL2_START_DATE,accounts[0]);
};
