/* eslint-disable import/prefer-default-export */
import { OvernightApi } from './services/ApiService/OvernightApi.ts';
import PoolService from './services/PoolService/PoolService.ts';

export const createContext = () => {
  const overnightApi = new OvernightApi();
  const poolService = new PoolService(overnightApi);

  return {
    PoolService: poolService,
  };
};
