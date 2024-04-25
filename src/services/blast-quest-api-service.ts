/* eslint-disable class-methods-use-this */
import { OVN_QUESTS_API } from '@/utils/const.ts';
import axios from 'axios';
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

  loadTwitterData(): any {
    return new Promise((resolve, reject) => {
      const url = `${OVN_QUESTS_API}/blast/twitter`;
      apiService.get(url)
        .then((data) => {
          resolve(data);
        })
        .catch((e) => {
          reject(e);
        });
    });
  }

  loadNicknameById(id: any) {
    return new Promise((resolve, reject) => {
      const url = 'https://twitter-api45.p.rapidapi.com/screenname.php';
      const params = {
        screenname: 'useless',
        rest_id: id,
      };
      const headers = {
        'X-RapidAPI-Key': '5b5921e2f5mshac0bc8983d564cfp1fdd4cjsn1746ed92ffa1',
        'X-RapidAPI-Host': 'twitter-api45.p.rapidapi.com',
      };

      axios.get(url, { params, headers })
        .then((response) => {
          resolve(response.data);
        })
        .catch((error) => {
          reject(error);
        });
    });
  }
}

export default new BlastQuestApiService();
