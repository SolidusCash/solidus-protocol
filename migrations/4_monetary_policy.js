const contract = require('@truffle/contract');
const { POOL1_START_DATE, REBASE_START_DATE } = require('./pools');
const knownContracts = require('./known-contracts');

const Cash = artifacts.require('Cash');
const Bond = artifacts.require('Bond');
const Share = artifacts.require('Share');
const IERC20 = artifacts.require('IERC20');
const MockBUSD = artifacts.require('MockBUSD');

const Oracle = artifacts.require('Oracle')
const Boardroom = artifacts.require('Boardroom')
const Treasury = artifacts.require('Treasury')

const UniswapV2Factory = artifacts.require('UniswapV2Factory');
const UniswapV2Router02 = artifacts.require('UniswapV2Router02');



async function migration(deployer, network, accounts) {
  let uniswap, uniswapRouter;
  console.log(network)
  if (['dev'].includes(network)) {
    console.log('Deploying uniswap on dev network.');
    await deployer.deploy(UniswapV2Factory, accounts[0]);
    uniswap = await UniswapV2Factory.deployed();

    await deployer.deploy(UniswapV2Router02, uniswap.address, accounts[0]);
    uniswapRouter = await UniswapV2Router02.deployed();
  } else {
    uniswap = await UniswapV2Factory.at(knownContracts.UniswapV2Factory[network]);
    uniswapRouter = await UniswapV2Router02.at(knownContracts.UniswapV2Router02[network]);
  }

  console.log('knownContracts.BUSD[network] = ' + knownContracts.BUSD[network])
  const busd = (network === 'bsc' || network === 'testnet') 
    ? await IERC20.at(knownContracts.BUSD[network])
    : await MockBUSD.deployed();

  console.log('busd address ' + busd.address)


  const cash = await Cash.deployed();
  const share = await Share.deployed();

  // Deploy oracle for the pair between bac and busd
  console.log("cash address is " + cash.address)
  console.log("busd address is " + busd.address)
  await deployer.deploy(
    Oracle,
    uniswap.address,
    cash.address,
    busd.address,
    POOL1_START_DATE,
  );


  // Deploy boardroom
  await deployer.deploy(Boardroom, cash.address, share.address);

  await deployer.deploy(
    Treasury,
    cash.address,
    Bond.address,
    Share.address,
    Oracle.address,
    Boardroom.address,
    REBASE_START_DATE
  );
}


module.exports = migration;