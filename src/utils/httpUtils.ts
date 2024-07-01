import Axios from 'axios';
import type { ContractAbi } from '@/types/common/abi';

// Outdated function. File structure and references left for compatibility
// Todo: remove 

// export const loadJSON = (url: string) => fetch(url, { method: 'GET' })
//   .then((response) => response.json());

export const loadJSON = async (src: string): Promise<ContractAbi> => {
  if (src) {
    console.log(src);
    try {
      const mod = await import(`@/${src}`);
      console.log('__module', mod);
      return mod.default;
    } catch (e) {
      console.error('Error loading dynamic path');
    }
  }
  return {} as ContractAbi;
};

export const axios = Axios.create({
  baseURL: '',
});
