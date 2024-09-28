/* eslint-disable import/prefer-default-export */
import { formatMoney as formatMonAcc } from 'accounting-js';
import BN from 'bignumber.js';

export const formatMoney = (number: number | string = 0, count = 6) => {
  if (!number || new BN(number).isNaN()) return 0;

  const num = new BN(number).toNumber();

  const buildConfig = {
    symbol: '',
    precision: count,
    thousand: [7, 8].includes(count) ? ',' : ' ',
  };

  return formatMonAcc(num, buildConfig);
};

// fixed by amount of numbers after dot
export const fixedByPriceChart = (price: number, zoomType: number) => {
  if (new BN(price).gt(100)) return 0;
  if (new BN(price).gt(10)) return 2 + zoomType;
  if (new BN(price).gt(2)) return 4 + zoomType;
  if (price == null) return 2;
  const orderOfMagnitude = Math.floor(Math.log10(price));
  const num = Math.max(2, orderOfMagnitude > 0 ? orderOfMagnitude + 3 : orderOfMagnitude * -1 + 3);
  return num > 8 ? 8 : num;
};

// fixed by amount of numbers after dot
export const fixedByPrice = (price: number) => {
  if (price == null) return 2;
  const orderOfMagnitude = Math.floor(Math.log10(price));
  const num = Math.max(2, orderOfMagnitude > 0 ? orderOfMagnitude + 3 : orderOfMagnitude * -1 + 3);
  return num > 8 ? 8 : num;
};

// getting fixed based on number, possible todo
export const getFixed = (val: string | BN) => {
  let fixed = 2;

  if (new BN(val).gt(10000)) fixed = 0;
  if (new BN(val).lt(0.1)) fixed = fixedByPrice(Number(val));

  return fixed;
};

export const getFixedMoney = (val: string) => formatMoney(val, getFixed(val));

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
