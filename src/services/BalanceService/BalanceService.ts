import { ethers } from 'ethers';
import { ZERO_ADDRESS } from '@/utils/const.ts';
import { ERC20_ABI } from '@/assets/abi/index.ts';
import { fetchTokenBalancesMulticall } from './utils/index.ts';

export interface IBalanceService {
  fetchNativeBalance(provider: any, account: string): any,
  fetchBalances(provider: any, account: string, tokenList: string[]): any,
  fetchTokenBalances(provider: any, account: string, tokenList: string[]): any,
}

class BalanceService implements IBalanceService {
  debouncedBalanceFetcher: (...args: any[]) => void;

  constructor() {
    // Initialize the debounced function with a 500ms delay
    this.debouncedBalanceFetcher = () => {};
  }

  // eslint-disable-next-line class-methods-use-this
  public async fetchNativeBalance(provider: any, account: string) {
    return provider.getBalance(account);
  }

  public static async fetchBalanceByAddress(provider: any, account: string, tokenAddress: string) {
    return new ethers.Contract(
      tokenAddress,
      ERC20_ABI,
      provider,
    ).balanceOf(account).catch(() => '0');
  }

  public async fetchBalances(
    provider: any,
    account: string,
    tokenList: string[] = [],
  ) {
    console.log('__BalanceServiceFetchBalances');
    const balancesData = await fetchTokenBalancesMulticall(provider, tokenList, account);

    const nativeTokenBalance = await this.fetchNativeBalance(provider, account);
    balancesData[ZERO_ADDRESS] = nativeTokenBalance.toString();

    return balancesData;
  }

  public async fetchTokenBalances(
    provider: any,
    account: string,
    tokenList: string[] = [],
  ) {
    return this.fetchBalances(provider, account, tokenList);
  }
}

export default BalanceService;
