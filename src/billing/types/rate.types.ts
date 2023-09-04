import { ContractType } from '@cryptodo/contracts';

export type Rate = {
  base: number;
  extra: { [key: string]: number };
};
export type IRates = {
  [key in ContractType]: Rate;
};
