/* eslint-disable import/prefer-default-export */
import {
  BLAST_TOKENS, LINEA_TOKENS, OP_TOKENS, SFRAX_TOKEN, ZKSYNC_TOKENS,
} from '@/constants/tokens/manualTokensMap.ts';

export const mergeTokenLists = (fetchedTokens: any) => {
  const tokensMap = {
    chainTokenMap: {
      ...fetchedTokens.chainTokenMap,
      ...BLAST_TOKENS,
      59144: {
        tokenMap: {
          ...fetchedTokens.chainTokenMap[59144]?.tokenMap,
          ...LINEA_TOKENS[59144].tokenMap,
        },
      },
      10: {
        tokenMap: {
          ...fetchedTokens.chainTokenMap[10]?.tokenMap,
          ...OP_TOKENS[10].tokenMap,
        },
      },
      8453: {
        tokenMap: {
          ...fetchedTokens.chainTokenMap[8453]?.tokenMap,
          ...SFRAX_TOKEN[8453].tokenMap,
        },
      },
      324: {
        tokenMap: {
          ...fetchedTokens.chainTokenMap[324]?.tokenMap,
          ...ZKSYNC_TOKENS[324].tokenMap,
        },
      },
    },
  };

  return tokensMap;
};
