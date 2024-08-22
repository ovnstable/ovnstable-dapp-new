/* eslint-disable import/prefer-default-export */
import { OvernightApi } from './services/ApiService/OvernightApi.ts';
import PoolService from './services/PoolService/PoolService.ts';
import TokenService from './services/TokenService/TokenService.ts';

export const createContext = () => {
  const overnightApi = new OvernightApi();
  const poolService = new PoolService(overnightApi);
  const tokenService = new TokenService(overnightApi);

  return {
    PoolService: poolService,
    TokenService: tokenService,
  };
};
