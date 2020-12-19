const {
  sosPools,
  INITIAL_SOS_FOR_BUSD_SOC,
  INITIAL_SOS_FOR_BUSD_SOS,
} = require('./pools');

// Pools
// deployed first
const Share = artifacts.require('Share');
const InitialShareDistributor = artifacts.require('InitialShareDistributor');

// ============ Main Migration ============

async function migration(deployer, network, accounts) {
  const unit = web3.utils.toBN(10 ** 18);
  const totalBalanceForBUSDSOC = unit.muln(INITIAL_SOS_FOR_BUSD_SOC)
  const totalBalanceForBUSDSOS = unit.muln(INITIAL_SOS_FOR_BUSD_SOS)
  const totalBalance = totalBalanceForBUSDSOC.add(totalBalanceForBUSDSOS);

  const share = await Share.deployed();

  const lpPoolBUSDSOC = artifacts.require(sosPools.BUSDSOC.contractName);
  const lpPoolBUSDSOS = artifacts.require(sosPools.BUSDSOS.contractName);

  await deployer.deploy(
    InitialShareDistributor,
    share.address,
    lpPoolBUSDSOC.address,
    totalBalanceForBUSDSOC.toString(),
    lpPoolBUSDSOS.address,
    totalBalanceForBUSDSOS.toString(),
  );
  const distributor = await InitialShareDistributor.deployed();

  await share.mint(distributor.address, totalBalance.toString());
  console.log(`Deposited ${INITIAL_SOS_FOR_BUSD_SOC} BAS to InitialShareDistributor.`);

  console.log(`Setting distributor to InitialShareDistributor (${distributor.address})`);
  await lpPoolBUSDSOC.deployed().then(pool => pool.setRewardDistribution(distributor.address));
  await lpPoolBUSDSOS.deployed().then(pool => pool.setRewardDistribution(distributor.address));

  await distributor.distribute();
}

module.exports = migration;
