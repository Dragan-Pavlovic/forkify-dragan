import {
  TIMEOUT_SEC,
  LOG_ERROR,
  LOG_ERROR_MESSAGE,
  LOG_ERROR_ALL,
} from './config';

const timeout = function (sec) {
  return new Promise(function (_, reject) {
    setTimeout(
      () =>
        reject(new Error(`Request took too long! Timeout after ${sec} second`)),
      sec * 1000
    );
  });
};

export const AJAX = async function (url, uploadData = undefined) {
  try {
    const fetchPro = uploadData
      ? fetch(url, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(uploadData),
        })
      : fetch(url);
    const res = await Promise.race([fetchPro, timeout(TIMEOUT_SEC)]);

    const data = await res.json();

    if (!res.ok) throw new Error(`${data.message} (statusCode:${res.status})`);

    return data;
  } catch (err) {
    throw logError('Handling error at helpers.js/AJAX', err);
  }
};

export const fetchImage = async function (url) {
  try {
    const res = await fetch(url);
    console.log('res', res);
    const imageBlob = await res.blob();
    return URL.createObjectURL(imageBlob);
  } catch (err) {
    throw logError('Handling error at helpers.js/fetchImage', err);
  }
  ``;
};

export const logError = function (msg, err) {
  if (err.doNotLogNext) return err;
  if (LOG_ERROR_MESSAGE) console.error(msg, err.message);
  if (LOG_ERROR) console.error(err);
  err.doNotLogNext = !LOG_ERROR_ALL;
  return err;
};
