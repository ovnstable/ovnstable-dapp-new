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

  async checkIfLikes(userName: any, tweetId: any, attempt = 1): Promise<any> {
    const url = 'https://twitter-api45.p.rapidapi.com/checklike.php';
    const params = {
      screenname: userName,
      tweet_id: tweetId,
    };
    const headers = {
      'X-RapidAPI-Key': import.meta.env.VITE_APP_API_KEY_TWITTER_API,
      'X-RapidAPI-Host': 'twitter-api45.p.rapidapi.com',
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

  async checkIfRetweet(userName: any, tweetId: any, attempt = 1): Promise<any> {
    const url = 'https://twitter-api45.p.rapidapi.com/checkretweet.php';
    const params = {
      screenname: userName,
      tweet_id: tweetId,
    };
    const headers = {
      'X-RapidAPI-Key': import.meta.env.VITE_APP_API_KEY_TWITTER_API,
      'X-RapidAPI-Host': 'twitter-api45.p.rapidapi.com',
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

  async getLastTweetsOvernight(attempt = 1): Promise<any> {
    const url = 'https://twitter-api45.p.rapidapi.com/usermedia.php';
    const params = {
      screenname: 'overnight_fi',
    };
    const headers = {
      'X-RapidAPI-Key': import.meta.env.VITE_APP_API_KEY_TWITTER_API,
      'X-RapidAPI-Host': 'twitter-api45.p.rapidapi.com',
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

  async checkTweetInfo(idTweet: any, attempt = 1): Promise<any> {
    const url = 'https://twitter-api45.p.rapidapi.com/tweet.php';
    const params = {
      id: idTweet,
    };
    const headers = {
      'X-RapidAPI-Key': import.meta.env.VITE_APP_API_KEY_TWITTER_API,
      'X-RapidAPI-Host': 'twitter-api45.p.rapidapi.com',
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
