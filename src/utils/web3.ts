export const getWeiMarker = (decimals: number) => {
  if (decimals === 1) {
    return 'wei';
  }

  if (decimals === 3) {
    return 'kwei';
  }

  if (decimals === 6) {
    return 'mwei';
  }

  if (decimals === 9) {
    return 'gwei';
  }

  if (decimals === 12) {
    return 'szabo';
  }

  if (decimals === 15) {
    return 'finney';
  }

  if (decimals === 18) {
    return 'ether';
  }

  if (decimals === 24) {
    return 'kether'; // mether same for 24, but more than kether with + 00
  }

  if (decimals === 27) {
    return 'gether';
  }

  if (decimals === 30) {
    return 'tether';
  }

  return 'ether';
};

export const g = 1;
