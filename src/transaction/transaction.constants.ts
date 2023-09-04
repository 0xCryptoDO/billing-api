import { ContractLike } from './types';

export const bscRpcUrl: ContractLike = {
  mainnet: 'https://bsc-dataseed.binance.org/',
  testnet: 'https://data-seed-prebsc-2-s1.binance.org:8545/',
};

export const contracts: { [key: string]: ContractLike } = {
  payments: {
    mainnet: '0xa05d1E1Ac778FdA8D3C83049Cc9211a6aCE4e57c',
    testnet: '0xd77DDA0e3b827a0D8C3210b889b739F52ee1d813',
  },
};
