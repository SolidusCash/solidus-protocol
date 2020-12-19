echo "truffle begin....."

truffle_cmd=node_modules/.bin/truffle-flattener

$truffle_cmd ./contracts/Boardroom.sol >  ./deployments/Boardroom.full.sol 
$truffle_cmd ./contracts/Bond.sol >  ./deployments/Bond.full.sol 
$truffle_cmd ./contracts/Cash.sol >  ./deployments/Cash.full.sol 
$truffle_cmd ./contracts/Oracle.sol >  ./deployments/Oracle.full.sol 
$truffle_cmd ./contracts/Share.sol >  ./deployments/Share.full.sol 
$truffle_cmd ./contracts/Timelock.sol >  ./deployments/Timelock.full.sol 
$truffle_cmd ./contracts/Treasury.sol >  ./deployments/Treasury.full.sol 


$truffle_cmd ./contracts/distributor/InitialCashDistributor.sol >  ./deployments/InitialCashDistributor.full.sol 
$truffle_cmd ./contracts/distributor/InitialShareDistributor.sol >  ./deployments/InitialShareDistributor.full.sol 

$truffle_cmd ./contracts/test/MockDai.sol >  ./deployments/MockDai.full.sol 
$truffle_cmd ./contracts/test/MockBUSD.sol >  ./deployments/MockBUSD.full.sol 
# $truffle_cmd ./contracts/test/MockWBNB.sol >  ./deployments/MockWBNB.full.sol 

$truffle_cmd ./contracts/distribution/BUSDSOCLPTokenSharePool.sol >  ./deployments/BUSDSOCLPTokenSharePool.full.sol 
$truffle_cmd ./contracts/distribution/BUSDSOSLPTokenSharePool.sol >  ./deployments/BUSDSOSLPTokenSharePool.full.sol 
$truffle_cmd ./contracts/distribution/SOCBUSDPool.sol >  ./deployments/SOCBUSDPool.full.sol 
$truffle_cmd ./contracts/distribution/SOCUSDCPool.sol >  ./deployments/SOCUSDCPool.full.sol 
$truffle_cmd ./contracts/distribution/SOCUSDTPool.sol >  ./deployments/SOCUSDTPool.full.sol 
$truffle_cmd ./contracts/distribution/SOCDAIPool.sol >  ./deployments/SOCDAIPool.full.sol 
$truffle_cmd ./contracts/distribution/SOCWBNBPool.sol >  ./deployments/SOCWBNBPool.full.sol 


echo "truffle end....."