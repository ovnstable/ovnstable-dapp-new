const possibleTextForRandom = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
// eslint-disable-next-line import/prefer-default-export
export const getRandomString = (randomLength = 10) => {
  let text = '';

  for (let i = 0; i < randomLength; i++) {
    text += possibleTextForRandom.charAt(Math.floor(Math.random() * possibleTextForRandom.length));
  }

  return text;
};

export const cutString = (str: string, takeFirst: number, takeLast: number) => {
  if (!str || str.length <= takeFirst + takeLast) {
    return str;
  }

  return (
    `${str.substring(0, takeFirst)
    }...${
      str.substring(str.length - takeLast, str.length)}`
  );
};
