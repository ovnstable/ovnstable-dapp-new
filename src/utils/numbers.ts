/* eslint-disable import/prefer-default-export */
import { formatMoney as formatMonAcc } from 'accounting-js';

export const formatMoney = (number = 0, count = 6) => {
  if (!number) {
    return 0;
  }

  const buildConfig = {
    symbol: '',
    precision: count,
    thousand: [7, 8].includes(count) ? ',' : ' ',
  };

  return formatMonAcc(number, buildConfig);
};

export const fixedByPrice = (price: number) => {
  if (price == null) {
    return 2;
  }
  const orderOfMagnitude = Math.floor(Math.log10(price));
  return Math.max(2, orderOfMagnitude + 2);
};
