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

  async getUserLikes(username: any): Promise<any> {
    const sleep = (ms: any) => new Promise((resolve) => { setTimeout(resolve, ms); });

    const getUserDetails = async (user: any, attempt = 1): Promise<any> => {
      const url = 'https://twitter154.p.rapidapi.com/user/details';
      const params = { username: user };
      const headers = {
        'X-RapidAPI-Key': import.meta.env.VITE_APP_API_KEY_TWITTER_API,
        'X-RapidAPI-Host': 'twitter154.p.rapidapi.com',
      };

      try {
        const response = await axios.get(url, { params, headers });
        return response.data;
      } catch (error: any) {
        if (error.response && error.response.status === 429 && attempt <= 10) {
          console.log(`Request rate limited. Retrying getUserDetails in 1.1 seconds... Attempt ${attempt}/10`);
          await sleep(1100);
          return getUserDetails(user, attempt + 1);
        }
        throw error;
      }
    };

    const getLikes = async (userId: any, attempt = 1): Promise<any> => {
      const url = 'https://twitter-v24.p.rapidapi.com/user/likes';
      const params = {
        user_id: userId,
        limit: '10',
      };
      const headers = {
        'X-RapidAPI-Key': import.meta.env.VITE_APP_API_KEY_TWITTER_API,
        'X-RapidAPI-Host': 'twitter-v24.p.rapidapi.com',
      };

      try {
        const response = await axios.get(url, { params, headers });
        return response.data;
      } catch (error: any) {
        if (error.response && error.response.status === 429 && attempt <= 10) {
          console.log(`Request rate limited. Retrying getLikes in 1.1 seconds... Attempt ${attempt}/10`);
          await sleep(3000);
          return getLikes(userId, attempt + 1);
        }
        throw error;
      }
    };

    try {
      console.log('let username to getUserDetails', username);
      const userDetails = await getUserDetails(username);
      console.log('here are our userDetails');
      console.log(userDetails);
      if (userDetails) {
        const userId = userDetails.user_id;
        const likes = await getLikes(userId);
        console.log('Likes:', likes);
        return likes;
      } console.error('User ID not found.');
    } catch (error) {
      console.error('Error in getUserLikes:', error);
    }
    return null;
  }

  async getLastTweetsOvernight(attempt = 1): Promise<any> {
    const url = 'https://twitter154.p.rapidapi.com/user/tweets';
    const params = {
      username: 'overnight_fi',
      limit: '1',
      include_replies: 'false',
      include_pinned: 'false',
    };
    const headers = {
      'X-RapidAPI-Key': import.meta.env.VITE_APP_API_KEY_TWITTER_API,
      'X-RapidAPI-Host': 'twitter154.p.rapidapi.com',
    };

    try {
      const response = await axios.get(url, { params, headers });
      return response.data;
    } catch (error: any) {
      if (error.response && error.response.status === 429 && attempt <= 10) {
        console.log(`Request rate limited. Retrying in 1.1 seconds... Attempt ${attempt}/3`);
        await this.sleep(1100);
        return this.getLastTweetsOvernight(attempt + 1);
      } throw error;
    }
  }

  sleep(ms: any) {
    return new Promise((resolve) => { setTimeout(resolve, ms); });
  }
}

export default new BlastQuestApiService();
