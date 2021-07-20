/**
 * Основная функция для совершения запросов
 * на сервер.
 * */
const createRequest = (options = {}) => {
  const { url, data, method, responseType, callback } = options;
  let xhr = new XMLHttpRequest;
  xhr.responseType = responseType;

  if (method.toLowerCase() == "get") {
    try {

      if (data) {
        const { user_id, id } = data;
        xhr.open(method, url + `?user_id=${user_id}&account_id=${id}`);
      } else {
        xhr.open(method, url);
      }

      xhr.send();
    } catch (e) {
      callback(e);
    }
  } else {
    try {
      const formData = new FormData();

      if (data) {

        for (const [key, value] of Object.entries(data)) {
          formData.append(key, value);
        }

      }

      xhr.open(method, url);
      xhr.send(formData);
    } catch (e) {
      callback(e);
    }
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