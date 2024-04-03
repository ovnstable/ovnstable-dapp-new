/* eslint-disable class-methods-use-this */
import { OVN_QUESTS_API } from '@/utils/const.ts';
import apiService from './api-service.ts';

class BlastQuestApiService {
  loadJackpot(): any {
    return new Promise((resolve, reject) => {
      const url = `${OVN_QUESTS_API}/blast/jackpot`;
      apiService.get(url)
        .then((data) => {
          resolve(data);
        })
        .catch((e) => {
          reject(e);
        });
    });
  }
}

export default new BlastQuestApiService();
