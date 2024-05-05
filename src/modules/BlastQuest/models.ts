/* eslint-disable no-unused-vars */
/* eslint-disable no-shadow */
import { TypeofQuest } from '@/components/QuestBox/Index.vue';

export type TSignedMessage = {
  pubKey: string;
  signature: string;
  message: string;
  nonce: string;
};

export const BOX_RANGES = [
  {
    quest: TypeofQuest.BRONZE,
    min: 0.00001,
    max: 0.03,
    minAmount: 1,
    minTest: 0.00001,
    maxTest: 0.000011,
    skew: 16,
  },
  {
    quest: TypeofQuest.SILVER,
    min: 0.00003,
    max: 0.075,
    minAmount: 5,
    minTest: 0.00001,
    maxTest: 0.000011,
    skew: 15,
  },
  {
    quest: TypeofQuest.GOLD,
    min: 0.0001,
    max: 0.1,
    minAmount: 15,
    minTest: 0.00001,
    maxTest: 0.000011,
    skew: 15,
  },
  {
    quest: TypeofQuest.DIAMOND,
    min: 0.0001,
    max: 0.2,
    minAmount: 100,
    minTest: 0.00001,
    maxTest: 0.000011,
    skew: 11,
  },
];

export enum IQuestId {
  FIRST = '0',
  SECOND = '1',
  THIRD = '2',
  FOURTH = '3',
}
