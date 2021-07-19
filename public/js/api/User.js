/**
 * Класс User управляет авторизацией, выходом и
 * регистрацией пользователя из приложения
 * Имеет свойство URL, равное '/user'.
 * */
class User {
  static URL = '/user';

  /**
   * Устанавливает текущего пользователя в
   * локальном хранилище.
   * */
  static setCurrent(user) {
    localStorage.setItem('user', JSON.stringify(user));
  }

  /**
   * Удаляет информацию об авторизованном
   * пользователе из локального хранилища.
   * */
  static unsetCurrent() {
    localStorage.removeItem('user');
  }

  /**
   * Возвращает текущего авторизованного пользователя
   * из локального хранилища
   * */
  static current() {

    if (JSON.parse(localStorage.getItem('user')) === null) {
      return;
    }

    return JSON.parse(localStorage.getItem('user'));
  }

  /**
   * Получает информацию о текущем
   * авторизованном пользователе.
   * */
  static fetch(callback) {
    createRequest({
      url: this.URL + '/current',
      method: 'GET',
      responseType: 'json',
      callback: (err, response) => {

        if (response.success === true) {
          this.setCurrent(response.user);
        } else {
          this.unsetCurrent();
        }

        callback(err, response);
      }
    });
  }

  /**
   * Производит попытку авторизации.
   * После успешной авторизации необходимо
   * сохранить пользователя через метод
   * User.setCurrent.
   * */
  static login(data, callback) {
    createRequest({
      url: this.URL + '/login',
      method: 'POST',
      responseType: 'json',
      data,
      callback: (err, response) => {

        if (response && response.user) {
          this.setCurrent(response.user);
          App.getForm('login').element.reset();
          App.setState('user-logged');
          App.getModal('login').close();
        } else {
          App.getForm('login').element.reset();

          if (App.getForm('login').element.lastElementChild.matches('.error')) {
            App.getForm('login').element.lastElementChild.remove();
          }

          showLoginError();

          function showLoginError() {
            let div = document.createElement('div');
            div.className = 'error';
            div.innerHTML = response.error;
            App.getForm('login').element.append(div);
          }
        }

      }
    });
  }

  /**
   * Производит попытку регистрации пользователя.
   * После успешной авторизации необходимо
   * сохранить пользователя через метод
   * User.setCurrent.
   * */
  static register(data, callback) {
    createRequest({
      url: this.URL + '/register',
      method: 'POST',
      responseType: 'json',
      data,
      callback: (err, response) => {

        if (response && response.user) {
          this.setCurrent(response.user);
          App.getForm('register').element.reset();
          App.setState('user-logged');
          App.getModal('register').close();
        } else {
          App.getForm('register').element.reset();

          if (App.getForm('register').element.lastElementChild.matches('.error')) {
            App.getForm('register').element.lastElementChild.remove();
          }

          showLoginError();

          function showLoginError() {
            let div = document.createElement('div');
            div.className = 'error';
            div.innerHTML = response.error;
            App.getForm('register').element.append(div);
          }
        }

      }
    });
  }

  /**
   * Производит выход из приложения. После успешного
   * выхода необходимо вызвать метод User.unsetCurrent
   * */
  static logout() {
    createRequest({
      url: this.URL + '/logout',
      method: 'POST',
      responseType: 'json',
      callback: (err, response) => {

        if (response.success === true) {
          this.unsetCurrent();
          App.setState('init');
        } else {
          console.log(response.error);
        }

      }
    });
  }

}
