import { ContractType } from '@cryptodo/contracts';

export const isProduction = process.env.NODE_ENV === 'production';

export const apiUrls = {
  contractApi: isProduction
    ? 'https://contract-api.cryptodo.app'
    : 'https://contract-api.staging.cryptodo.app',
  userApi: isProduction
    ? 'https://users-api.cryptodo.app'
    : 'https://users-api.staging.cryptodo.app',
};

export const contractPaths: Record<ContractType, string> = {
  [ContractType.erc20Contract]: 'erc20',
  [ContractType.erc20DefContract]: 'erc20/def',
  [ContractType.erc721Contract]: 'erc721',
  [ContractType.icoContract]: 'ico',
  [ContractType.daoContract]: 'dao',
  [ContractType.lotteryContract]: 'lottery',
  [ContractType.airDropContract]: 'airDrop',
  [ContractType.multisigContract]: 'multisig',
  [ContractType.vestingContract]: 'vesting',
  [ContractType.stakingContract]: 'staking',
  [ContractType.erc1155Contract]: 'erc1155',
  [ContractType.erc4626Contract]: 'erc4626',
};
