/* eslint-disable class-methods-use-this */
import axios from 'axios';

function cloneObject(src: any) {
  return { ...src };
}

const baseHeaders = {};

const notification = function (type: any, message: any, ttl: any) {
  console.error('Unhandled ', type, ': ', message, 'ttl', ttl);
};

const onSuccess = function (callback: any) {
  return function (data: any) {
    if (callback) {
      callback(data.data);
    }
  };
};

const onError = function (errorCallback: any) {
  const defaultErrorHandler = function (data: any) {
    if (data.code) {
      notification('warning', data.message, 5000);
    } else if (data.errors) {
      // default spring error handling
      notification('warning', data.errors[0].default_message, 5000);
    } else {
      notification('error', 'Unknown error', 5000);
    }
  };

  return function (data: any) {
    // eslint-disable-next-line no-param-reassign
    data = data.response ? data.response.data : data;

    if (!errorCallback) {
      defaultErrorHandler(data);
      return;
    }

    errorCallback(data, () => { defaultErrorHandler(data); });
  };
};

const wrapPromise = function (promise: any) {
  return new Promise((resolve, reject) => {
    promise
      .then(onSuccess(resolve))
      .catch(onError(reject));
  });
};

const getHeaders = function (contentType: any) {
  const headers = cloneObject(baseHeaders);
  if (contentType) headers['Content-Type'] = contentType;
  return headers;
};

const transformRequest = function (obj: any) {
  const str = [];
  // eslint-disable-next-line no-restricted-syntax, guard-for-in
  for (const p in obj) {
    str.push(`${encodeURIComponent(p)}=${encodeURIComponent(obj[p])}`);
  }
  return str.join('&');
};

export class ApiService {
  get(url: any) {
    return wrapPromise(axios.get(url));
  }

  postJson(url: any, data: any) {
    const options = { headers: getHeaders('application/json') };
    return wrapPromise(axios.post(url, data, options));
  }

  putJson(url: any, data: any) {
    return wrapPromise(axios.put(url, data, { headers: getHeaders('application/json') }));
  }

  delete(url: any, data: any) {
    const options = { headers: getHeaders('application/x-www-form-urlencoded') };
    const responseFuture = axios.delete(data ? this.uri(url, data) : url, options);

    return wrapPromise(responseFuture);
  }

  uri(path: any, paramsObject: any) {
    const params = transformRequest(paramsObject);
    return `${path}?${params}`;
  }

  postMultipart(url: any, formData: any) {
    const options = { headers: getHeaders('multipart/form-data') };
    return wrapPromise(axios.post(url, formData, options));
  }
}

export default new ApiService();
