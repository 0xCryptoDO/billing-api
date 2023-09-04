import { isProduction } from 'src/constants';

export const defaultReferralWallet =
  '0xc3cf06f9010A8D065dcA5DF5Da73E3632FA25d4c';

export const referralLinkTemplate = isProduction
  ? 'https://lab.cryptodo.app?ref='
  : 'https://lab.staging.cryptodo.app?ref=';
