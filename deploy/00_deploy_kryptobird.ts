import { HardhatRuntimeEnvironment } from 'hardhat/types';
// eslint-disable-next-line node/no-missing-import
import { DeployFunction } from 'hardhat-deploy/types';

const contractName = 'KryptoBird';

const func: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {
  const { deployments, getNamedAccounts } = hre;
  const { deploy, log } = deployments;
  const useProxy = !hre.network.live;

  const { deployer } = await getNamedAccounts();

  const deployResult = await deploy(contractName, {
    from: deployer,
    proxy: useProxy && 'postUpgrade',
    args: [contractName],
    log: true,
    autoMine: true,
  });

  if (deployResult.newlyDeployed) {
    log(`\nDeployed '${contractName}'`);
    log('------------------------------');
    log(`transaction hash: ${deployResult.transactionHash}`);
    log(`contract address: ${deployResult.address}`);
    log(`gas used: ${deployResult.receipt?.gasUsed}`);
    log('\n');
  }

  return !useProxy;
};
export default func;

func.id = `deploy_${contractName}`;
func.tags = [contractName];
