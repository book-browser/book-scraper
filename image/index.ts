import axios from 'axios';

export const getBase64FromUrl = async (url) => {
  try {
    const response = await axios.get(url, {
      responseType: 'arraybuffer'
    });
    return Buffer.from(response.data, 'binary').toString('base64');
  } catch (e) {
    e.message = `Unable to load base 64 for url ${url} -- ${e.message}`;
    throw e;
  }
};
