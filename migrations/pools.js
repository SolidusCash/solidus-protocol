// https://docs.basis.cash/mechanisms/yield-farming
const INITIAL_SOC_FOR_POOLS = 50000;
const INITIAL_SOS_FOR_BUSD_SOC = 750000;
const INITIAL_SOS_FOR_BUSD_SOS = 250000;

const POOL1_START_DATE = Date.parse('2020-12-18 22:00:00 GMT +8') / 1000;
console.log('POOL1_START_DATE = '+POOL1_START_DATE);
const DAY = 86400;
const HOUR = 3600;
const POOL2_START_DATE = POOL1_START_DATE +  2 * DAY;
const REBASE_START_DATE = POOL1_START_DATE + 5 * DAY;



const socPools = [
  { contractName: 'SOCBUSDPool', token: 'BUSD' },
  { contractName: 'SOCWBNBPool', token: 'WBNB' },
  { contractName: 'SOCUSDCPool', token: 'USDC' },
  { contractName: 'SOCUSDTPool', token: 'USDT' },
  { contractName: 'SOCDAIPool', token: 'DAI' },
];

const sosPools = {
  BUSDSOC: { contractName: 'BUSDSOCLPTokenSharePool', token: 'BUSD_SOC-LPv2' },
  BUSDSOS: { contractName: 'BUSDSOSLPTokenSharePool', token: 'BUSD_SOS-LPv2' },
}

module.exports = {
  POOL1_START_DATE,
  POOL2_START_DATE,
  REBASE_START_DATE,
  INITIAL_SOC_FOR_POOLS,
  INITIAL_SOS_FOR_BUSD_SOC,
  INITIAL_SOS_FOR_BUSD_SOS,
  socPools,
  sosPools,
};
