import { ethers } from 'ethers';

export const chainContractsMap = {
  optimism: {
    usdPlus: {
      tokenPlus: '0x73cb180bf0521828d8849bc8CF2B920918e23032',
      exchange: '0xe80772Eaf6e2E18B651F160Bc9158b2A5caFCA65',
      mark2market: '0x9Af655c4DBe940962F776b685d6700F538B90fcf',
      portfolioManager: '0xe1E36e93D31702019D38d2B0F6aB926f15008409',
      wUsdPlus: '0xA348700745D249c3b49D2c2AcAC9A5AE8155F826',
    },
    daiPlus: {
      tokenPlus: '0x970D50d09F3a656b43E11B0D45241a84e3a6e011',
      exchange: '0x7C7938B6a1eF49470aa53Da53bE9A0baa8CE0b10',
      mark2market: '0x8416d215b71a5C91b04E326140bbbDcDa82C01da',
      portfolioManager: '0x542BdE36670D066d9386bD7b174Cc81199B2e6A7',
    },
    ovn: '0x3b08fcd15280e7B5A6e404c4abb87F7C774D1B2e',
    ovnGovernor: '0x279a30ed284D49D32De901acfC0004B2dB1c091E',
    ovnTimelockController: '0xA4fc2F25CA4dFEc08F07eE92d3173BA21A01E9f8',
    usdc: '0x7F5c764cBc14f9669B88837ca1490cCa17c31607',
    market: '0x9489d4769d3AbD3483421Fbff41BD6C7fe8541cA',
    dai: '0xda10009cbd5d07dd0cecc66161fc93d7c9000da1',
    exchange_insurance: '0xB8F254F316FFa6d53969F8D4b01CAC25Ac8A2d08',
    token_insurance: '0x5E3C33e152Be20835B9c33071C411B616688c754',
  },
  arbitrum: {
    usdPlus: {
      tokenPlus: '0xe80772Eaf6e2E18B651F160Bc9158b2A5caFCA65',
      exchange: '0x73cb180bf0521828d8849bc8CF2B920918e23032',
      mark2market: '0x9Af655c4DBe940962F776b685d6700F538B90fcf',
      portfolioManager: '0x5Fb8ab30E3cC24b976c005e0C4B5eAf88A537276',
      wUsdPlus: '0xB86fb1047A955C0186c77ff6263819b37B32440D',
    },
    daiPlus: {
      tokenPlus: '0xeb8E93A0c7504Bffd8A8fFa56CD754c63aAeBFe8',
      exchange: '0xc8261DC93428F0D2dC04D675b7852CdCdC19d4fd',
      mark2market: '0xF04124F4226389d1Bf3ad7AcB54da05fF4078c8b',
      portfolioManager: '0xB551BE6de9c9fae3B83310BA4e1768327Dc0e2FC',
    },
    usdtPlus: {
      tokenPlus: '0xb1084db8D3C05CEbd5FA9335dF95EE4b8a0edc30',
      exchange: '0x8b80Da76AAb8798Fd537A9A83f462CDA69eC1EE4',
      mark2market: '0xf3607bB88738c3388b543d390a90B6ABF4046E3b',
      portfolioManager: '0x9aa95b5e2E3ecFAb56fB6b955Ad7Fc59bDB94264',
    },
    ethPlus: {
      tokenPlus: '0xD4939D69B31fbE981ed6904A3aF43Ee1dc777Aab',
      exchange: '0xbb5ea28ec8044E3ce55c459C47EEDed8c6CB685f',
      mark2market: '0x672F0f9ECF78406E4E31cd531b0CefE32f0A84B5',
      portfolioManager: '0x769B4EFA1560AF66D4FE338A5041cB5710352583',
    },
    wEthPlus: {
      tokenPlus: '0x72f99511615Cd8fA4D776d76bb8B8f7A5162F60F',
    },
    ovn: '0xA3d1a8DEB97B111454B294E2324EfAD13a9d8396',
    usdc: '0xff970a61a04b1ca14834a43f5de4533ebddb5cc8',
    wrapped: '0x82af49447d8a07e3bd95bd0d56f35241523fbab1',
    market: '0x149Eb6E777aDa78D383bD93c57D45a9A71b171B1',
    dai: '0xda10009cbd5d07dd0cecc66161fc93d7c9000da1',
    usdt: '0xFd086bC7CD5C481DCC9C85ebE478A1C0b69FCbb9',
    marketWeth: '0x1C47D35DF5A18f592A8ee128A372780C746003D1',
    wETH: '0x82af49447d8a07e3bd95bd0d56f35241523fbab1',
    token_insurance: '0x5566266841694f640c1575c819a4837779b12535',
  },
  zksync: {
    usdPlus: {
      tokenPlus: '0x8E86e46278518EFc1C5CEd245cBA2C7e3ef11557',
      exchange: '0x84d05333f1F5Bf1358c3f63A113B1953C427925D',
      mark2market: '0x240aad990FFc5F04F11593fF4dCF1fF714d6fc80',
      portfolioManager: '0xA970de9a2ADB8653708E06F76666CF00d63fe67B',
    },
    usdc: '0x3355df6d4c9c3035724fd0e3914de96a5a83aaf4',
  },
  linea: {
    usdPlus: {
      tokenPlus: '0xB79DD08EA68A908A97220C76d19A6aA9cBDE4376',
      exchange: '0x7cb1B38591021309C64f451859d79312d8Ca2789',
      mark2market: '0x1F4947Cd5A5c058DD5EA6Fd1CCd5c311aDa9E6Fb',
      portfolioManager: '0x27B12F3282F1d02682D7D1AD30E45e818B78f7B8',
    },
    usdtPlus: {
      tokenPlus: '0x1E1F509963A6D33e169D9497b11c7DbFe73B7F13',
      exchange: '0x2602848d8eB53aa9bff5b41B38656439C15Dc72A',
      mark2market: '0x3d67655A49Adb0F44530233Cbf8375D33FfAde41',
      portfolioManager: '0x0932BB4c7e4bdD9cd717331b86d999046f8420E0',
    },
    usdc: '0x176211869cA2b568f2A7D4EE941E073a821EE1ff',
    usdt: '0xA219439258ca9da29E9Cc4cE5596924745e12B93',
  },
  base: {
    usdcPlus: {
      tokenPlus: '0x85483696Cc9970Ad9EdD786b2C5ef735F38D156f',
      exchange: '0x868D69875BF274E7Bd3d8b97b1Acd89dbdeb67af',
      mark2market: '0x96aa0bBe4D0dea7C4AF4739c53dBFA0300262253',
      portfolioManager: '0x619A500F1Ae543823B1c33dB63De99F83aC057e4',
      wUsdPlus: '',
    },
    usdPlus: {
      tokenPlus: '0xB79DD08EA68A908A97220C76d19A6aA9cBDE4376',
      exchange: '0x7cb1B38591021309C64f451859d79312d8Ca2789',
      mark2market: '0x1F4947Cd5A5c058DD5EA6Fd1CCd5c311aDa9E6Fb',
      portfolioManager: '0x27B12F3282F1d02682D7D1AD30E45e818B78f7B8',
      wUsdPlus: '0xd95ca61CE9aAF2143E81Ef5462C0c2325172E028',
    },
    daiPlus: {
      tokenPlus: '0x65a2508C429a6078a7BC2f7dF81aB575BD9D9275',
      exchange: '0xF7d693CE960e70721F0353F967360046Ba7d4eFA',
      mark2market: '0x7a62315519A39d562c1E49EB35b300d2E6742f86',
      portfolioManager: '0xb9619DB586972CC0754a22e1697a72Bacf30aca9',
    },
    ovn: '0xA3d1a8DEB97B111454B294E2324EfAD13a9d8396',
    usdc: '0xd9aAEc86B65D86f6A7B5B1b0c42FFA531710b6CA',
    usdcNative: '0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913',
    market: '0x20FAF24BEb86B81092D63E95A6E764C4fEd85873',
    dai: '0x50c5725949a6f0c72e6c4a641f24049a917db0cb',
  },
  bsc: {
    usdPlus: {
      tokenPlus: '0xe80772Eaf6e2E18B651F160Bc9158b2A5caFCA65',
      exchange: '0x5A8EEe279096052588DfCc4e8b466180490DB821',
      mark2market: '0x9Af655c4DBe940962F776b685d6700F538B90fcf',
      portfolioManager: '0xff34aad62aeA14E1dA04E90967b36c188Ac9A770',
    },
    usdtPlus: {
      tokenPlus: '0x5335E87930b410b8C5BB4D43c3360ACa15ec0C8C',
      exchange: '0xd3F827C0b1D224aeBCD69c449602bBCb427Cb708',
      mark2market: '0xF3434f6a11AA950150AF3e4962E39E6281496EF9',
      portfolioManager: '0x4788b55aBcA88610F1586A90017337399A62f8ae',
    },
    usdc: '0x8ac76a51cc950d9822d68b83fe1ad97b32cd580d', // pegged usdc
    wrapped: '0x8ac76a51cc950d9822d68b83fe1ad97b32cd580d', // pegged usdc
    usdt: '0x55d398326f99059fF775485246999027B3197955', // pegged usdt
  },
  polygon: {
    usdPlus: {
      tokenPlus: '0x236eeC6359fb44CCe8f97E99387aa7F8cd5cdE1f',
      exchange: '0x6B3712943A913EB9A22B71D4210DE6158c519970',
      mark2market: '0x33efB0868A6f12aEce19B451e0fcf62302Ec4A72',
      portfolioManager: '0x6911F2e474D34a4cbBE9Fe56F909EA37DF15E649',
      wUsdPlus: '0x4e36D8006416EA1d939A0EeaE73AFDAcA86BD376',
    },
    usdc: '0x2791bca1f2de4661ed88a30c99a7a9449aa84174',
    market: '0x4f1499185aBf3BcAb91a9B77DDC113f97bF0342C',
    dai: '0x8f3Cf7ad23Cd3CaDbD9735AFf958023239c6A063',
  },
};

export const buildEvmContract = (abi: any, signer: any, address: string) => {
  let contractAdd = address;

  if (!address) contractAdd = abi.address;

  return new ethers.Contract(
    contractAdd,
    abi,
    signer,
  );
};

export function buildEvmContractForChain(abi: any, signer: any, address: string) {
  if (!address) return null;
  return new ethers.Contract(
    address,
    abi,
    signer,
  );
}
