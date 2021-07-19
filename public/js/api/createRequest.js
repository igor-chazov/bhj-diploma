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
        console.log(data);
        for (const [key, value] of Object.entries(data)) {
          let urlSearch = new URL(url);
          urlSearch.searchParams.set(key, value);
          xhr.open(method, urlSearch);
        }

        // if (data.email && data.password) {
        //   let urlSearch = new URL(url);
        //   urlSearch.searchParams.set('email', data.email);
        //   urlSearch.searchParams.set('password', data.password);
        //   xhr.open(method, urlSearch);
        // }

      } else {
        xhr.open(method, url);
      }

      xhr.send();
    }
    catch (e) {
      callback(e);
    }

  } else {
    try {
      const formData = new FormData();

      if (data) {
        console.log(data);
        for (const [key, value] of Object.entries(data)) {
          formData.append(key, value);
        }

        // if (data.type && data.name && data.sum && data.account_id) {
        //   formData.append('type', data.type);
        //   formData.append('name', data.name);
        //   formData.append('sum', data.sum);
        //   formData.append('account_id', data.account_id);
        // } else if (data.name && data.email && data.password) {
        //   formData.append('name', data.name);
        //   formData.append('email', data.email);
        //   formData.append('password', data.password);
        // } else if (data.email && data.password) {
        //   formData.append('email', data.email);
        //   formData.append('password', data.password);
        // } else if (data.name) {
        //   formData.append('name', data.name);
        // }

      }

      xhr.open(method, url);
      xhr.send(formData);

    }
    catch (e) {
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