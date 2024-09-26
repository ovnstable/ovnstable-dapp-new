/* eslint-disable import/prefer-default-export */
import { OvernightApi } from './services/ApiService/OvernightApi.ts';
import PoolService from './services/PoolService/PoolService.ts';
import TokenService from './services/TokenService/TokenService.ts';
import BalanceService from './services/BalanceService/BalanceService.ts';
import PosthogService from './services/PosthogService/PosthogService.ts';

export const createContext = () => {
  const overnightApi = new OvernightApi();
  const poolService = new PoolService(overnightApi);
  const tokenService = new TokenService(overnightApi);
  const balanceService = new BalanceService();
  const posthogService = PosthogService.getInstance();

  return {
    PoolService: poolService,
    TokenService: tokenService,
    BalanceService: balanceService,
    PosthogService: posthogService,
    OvernightApi: overnightApi,
  };
};
