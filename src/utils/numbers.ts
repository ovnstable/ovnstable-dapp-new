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
  if (price == null) return 2;
  const orderOfMagnitude = Math.floor(Math.log10(price));
  const num = Math.max(2, orderOfMagnitude > 0 ? orderOfMagnitude + 3 : orderOfMagnitude * -1 + 3);
  return num > 8 ? 8 : num;
};

export const formatMoneyComma = (number = 0, count = 6) => {
  if (!number) {
    return 0;
  }

  return formatMonAcc(number, {
    symbol: '',
    precision: count,
    thousand: ',',
  });
};

export const formatNumberToMln = (num: number, count = 3) => {
  const res = num / 1000000;
  let countVal = count;
  if (res < 1) countVal = 3;

  return (res).toFixed(countVal);
};

export const formatNumberToThousands = (num:number, count = 3) => {
  const res = num / 1000;
  let countVal = count;
  if (res < 1) countVal = 3;

  return (res).toFixed(countVal);
};
