import { ContractType, Network } from '@cryptodo/contracts';
import { IRates, Rate } from './types';

export class RatesService {
  constructor() {
    this.walletsWithUsersRate = this.walletsWithUsersRate.map((wallet) =>
      wallet.toLowerCase(),
    );
  }

  private rates: IRates = {
    [ContractType.erc20Contract]: {
      base: 50,
      extra: {
        blacklist: 10,
        pause: 10,
        burn: 8,
        mint: 8,
        aiFunction: 10,
      },
    },
    [ContractType.erc20DefContract]: {
      base: 10,
      extra: {
        blacklist: 2,
        pause: 2,
        burn: 2,
        mint: 2,
        taxBurn: 2,
        team: 2,
        liquidity: 2,
        aiFunction: 10,
      },
    },
    [ContractType.icoContract]: {
      base: 50,
      extra: {
        aiFunction: 10,
      },
    },
    [ContractType.erc721Contract]: {
      base: 10,
      extra: {
        incrementTokenMaxAmount: 5,
        presale: 5,
        aiFunction: 10,
      },
    },
    [ContractType.lotteryContract]: {
      base: 10,
      extra: {
        aiFunction: 10,
      },
    },
    [ContractType.daoContract]: {
      base: 10,
      extra: {
        aiFunction: 10,
      },
    },
    [ContractType.multisigContract]: {
      base: 10,
      extra: {
        aiFunction: 10,
      },
    },
    [ContractType.vestingContract]: {
      base: 10,
      extra: {
        aiFunction: 10,
      },
    },
    [ContractType.airDropContract]: {
      base: 10,
      extra: {
        aiFunction: 10,
      },
    },
    [ContractType.stakingContract]: {
      base: 10,
      extra: {
        aiFunction: 10,
        penalty: 5,
      },
    },
    [ContractType.erc4626Contract]: {
      base: 10,
      extra: {
        aiFunction: 10,
      },
    },
    [ContractType.erc1155Contract]: {
      base: 10,
      extra: {
        aiFunction: 10,
      },
    },
  };

  private differentRates: Partial<Record<Network, Partial<IRates>>> = {};

  private walletsWithUsersRate = ['0xfC469C1569585F131Ad21724796dbD56687524D2'];

  private userRates: Partial<IRates> = {
    [ContractType.airDropContract]: {
      base: 0.1,
      extra: {
        aiFunction: 0.1,
      },
    },
    [ContractType.erc20Contract]: {
      base: 0.1,
      extra: {
        blacklist: 0.1,
        pause: 0.1,
        burn: 0.1,
        mint: 0.1,
        aiFunction: 0.1,
      },
    },
    [ContractType.erc20DefContract]: {
      base: 0.1,
      extra: {
        blacklist: 0.1,
        pause: 0.1,
        burn: 0.1,
        mint: 0.1,
        taxBurn: 0.1,
        team: 0.1,
        liquidity: 0.1,
        aiFunction: 0.1,
      },
    },
    [ContractType.icoContract]: {
      base: 0.1,
      extra: {
        aiFunction: 0.1,
      },
    },
    [ContractType.erc721Contract]: {
      base: 0.1,
      extra: {
        incrementTokenMaxAmount: 0.1,
        presale: 0.1,
        aiFunction: 0.1,
      },
    },
    [ContractType.lotteryContract]: {
      base: 0.1,
      extra: {
        aiFunction: 0.1,
      },
    },
    [ContractType.daoContract]: {
      base: 0.1,
      extra: {
        aiFunction: 0.1,
      },
    },
    [ContractType.multisigContract]: {
      base: 0.1,
      extra: {
        aiFunction: 0.1,
      },
    },
    [ContractType.vestingContract]: {
      base: 0.1,
      extra: {
        aiFunction: 0.1,
      },
    },
    [ContractType.stakingContract]: {
      base: 0.1,
      extra: {
        aiFunction: 0.1,
        penalty: 0.1,
      },
    },
  };

  public cdoUsdPrice = 0.05;

  public getRates = (
    wallet: string,
    contractType: ContractType,
    network: Network,
  ): Rate => {
    if (
      this.walletsWithUsersRate.includes(wallet.toLowerCase()) &&
      this.userRates[contractType]
    ) {
      return this.userRates[contractType];
    }
    if (
      this.differentRates[network] &&
      this.differentRates[network][contractType]
    ) {
      return this.differentRates[network][contractType];
    }
    return this.rates[contractType];
  };
}
