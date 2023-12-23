import Axios from 'axios';

export const loadJSON = (url: string) => fetch(url, { method: 'GET' })
  .then((response) => response.json());

export const axios = Axios.create({
  baseURL: `${process?.env?.VUE_APP_HOST ? process?.env?.VUE_APP_HOST : ''}`,
});
