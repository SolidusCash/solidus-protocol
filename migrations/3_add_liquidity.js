const contract = require('@truffle/contract');
const { POOL_START_DATE } = require('./pools');
const knownContracts = require('./known-contracts');

const Cash = artifacts.require('Cash');
const Share = artifacts.require('Share');
const IERC20 = artifacts.require('IERC20');
const MockBUSD = artifacts.require('MockBUSD');

const UniswapV2Factory = artifacts.require('UniswapV2Factory');
const UniswapV2Router02 = artifacts.require('UniswapV2Router02');

const DAY = 86400;

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
  // 2. provide liquidity to BAC-DAI and BAS-DAI pair
  // if you don't provide liquidity to BAC-DAI and BAS-DAI pair after step 1 and before step 3,
  //  creating Oracle will fail with NO_RESERVES error.
  const unit = web3.utils.toBN(10 ** 18).toString();
  const max = web3.utils.toBN(10 ** 18).muln(10000).toString();

  const cash = await Cash.deployed();
  const share = await Share.deployed();

  console.log('Approving Uniswap on tokens for liquidity');
  await Promise.all([
    approveIfNot(cash, accounts[0], uniswapRouter.address, max),
    approveIfNot(share, accounts[0], uniswapRouter.address, max),
    approveIfNot(busd, accounts[0], uniswapRouter.address, max),
  ]);

  // WARNING: msg.sender must hold enough DAI to add liquidity to BAC-DAI & BAS-DAI pools
  // otherwise transaction will revert
  console.log('Adding liquidity to pools, router is ' + uniswapRouter.address);
  await uniswapRouter.addLiquidity(
    cash.address, busd.address, unit, unit, unit, unit, accounts[0], deadline(),
  );
  await uniswapRouter.addLiquidity(
    share.address, busd.address, unit, unit, unit, unit, accounts[0],  deadline(),
  );

  console.log(`BUSD-SOC pair address: ${await uniswap.getPair(busd.address, cash.address)}`);
  console.log(`BUSD-SOS pair address: ${await uniswap.getPair(busd.address, share.address)}`);
}

async function approveIfNot(token, owner, spender, amount) {
  const allowance = await token.allowance(owner, spender);
  if (web3.utils.toBN(allowance).gte(web3.utils.toBN(amount))) {
    return;
  }
  await token.approve(spender, amount);
  console.log(` - Approved ${token.symbol ? (await token.symbol()) : token.address}`);
}

function deadline() {
  // 30 minutes
  return Math.floor(new Date().getTime() / 1000) + 1800;
}

module.exports = migration;