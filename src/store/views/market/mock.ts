import { type Tokens } from '@/modules/Market/types/index.ts';

// eslint-disable-next-line import/prefer-default-export
export const TOKENS: Tokens = {
  usd: {
    tokenName: 'USD+',
    tokenImageName: 'USD+_money_markets',
    collateralToken: 'USDC',
    description: 'A risk-minimised USDC-pegged crypto asset backed by an underlying basket of USD stablecoins',
    tokenLink: '0xe80772Eaf6e2E18B651F160Bc9158b2A5caFCA65',
  },
  usdc: {
    tokenName: 'USDC+',
    tokenImageName: 'USDC+_money_markets',
    collateralToken: 'USDC',
    description: 'A risk-minimised USDC-pegged crypto asset backed by an underlying basket of USD stablecoins',
    tokenLink: '0x85483696Cc9970Ad9EdD786b2C5ef735F38D156f',
  },
  eth: {
    tokenName: 'ETH+',
    tokenImageName: 'ETH+_money_markets',
    collateralToken: 'WETH',
    description: 'ETH+ is the equivalent of USD+, pegged to ETH 1:1, instantly mintable and redeemable in ETH. 100% collateralized with delta-neutral and other strategies based on the best protocols.',
    tokenLink: '0xD4939D69B31fbE981ed6904A3aF43Ee1dc777Aab',
  },
  usdt: {
    tokenName: 'USDT+',
    tokenImageName: 'USDT+_money_markets',
    collateralToken: 'USDT',
    description: 'USDT+ is the equivalent of USD+, pegged to USDT 1:1. USDT+ consist of aUSDT (Aave) and USD+. It has been designed for boosted pools (Balancer and Beethoven) on BSC. It cannot be minted separately.',
    tokenLink: '0xb1084db8D3C05CEbd5FA9335dF95EE4b8a0edc30',
  },
  dai: {
    tokenName: 'DAI+',
    tokenImageName: 'DAI+_money_markets',
    collateralToken: 'DAI',
    description: 'DAI+ is the equivalent of USD+, pegged to DAI 1:1. DAI+ consist of aDAI (Aave) and USD+. It has been designed for boosted pools (Balancer and Beethoven) on Optimism. It cannot be minted separately.',
    tokenLink: '0xeb8E93A0c7504Bffd8A8fFa56CD754c63aAeBFe8',
  },
};
