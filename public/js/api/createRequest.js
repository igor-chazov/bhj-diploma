/**
 * Основная функция для совершения запросов
 * на сервер.
 * */
const createRequest = (options = {}) => {
  const { url, data, method, responseType, callback } = options;
  let xhr = new XMLHttpRequest;
  xhr.responseType = responseType;
  let formData, urlSaerch;

  if (method.toLowerCase() == "get") {

    if (data) {

      for (let [key, value] of Object.entries(data)) {

        if (key === 'id') key = 'account_id';

        if (!urlSaerch) {
          urlSaerch = '/?' + key + '=' + value;
        }

        urlSaerch += '&' + key + '=' + value;
      }

    }

  } else {
    formData = new FormData();

    if (data) {

      for (const [key, value] of Object.entries(data)) {
        formData.append(key, value);
      }

    }

  }

  try {
    xhr.open(method, url + (urlSaerch || ''));
    xhr.send(formData || null);
  } catch (e) {
    callback(e);
  }

  xhr.onload = function () {

    if (xhr.status != 200) {
      callback(err, xhr.response);
    }

    callback(null, xhr.response);
  }

  xhr.onerror = function () {
    throw Error('Запрос не удался, возможно нет соединения');
  };

}