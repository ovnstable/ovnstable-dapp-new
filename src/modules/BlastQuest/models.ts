/* eslint-disable no-unused-vars */
/* eslint-disable no-shadow */
export type TSignedMessage = {
  pubKey: string;
  signature: string;
  message: string;
  nonce: string;
};

export enum TypeofQuest {
  BRONZE,
  SILVER,
  GOLD,
  DIAMOND
}
