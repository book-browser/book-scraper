import axios from 'axios';

export const getBase64FromUrl = async (url) => {
  return axios
    .get(url, {
      responseType: 'arraybuffer'
    })
    .then((response) => Buffer.from(response.data, 'binary').toString('base64'));
};
