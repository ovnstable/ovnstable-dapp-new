/* eslint-disable import/prefer-default-export */
import { ethers } from 'ethers';

// @Injectable()
export class ProviderService {
  private provider: ethers.JsonRpcProvider;

  constructor(rpcUrl: string) {
    this.provider = new ethers.JsonRpcProvider(rpcUrl);
  }

  getProvider(): ethers.Provider {
    return this.provider;
  }
}
