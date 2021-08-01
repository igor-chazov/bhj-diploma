/**
 * Класс LoginForm управляет формой
 * входа в портал
 * */
class LoginForm extends AsyncForm {
  /**
   * Производит авторизацию с помощью User.login
   * После успешной авторизации, сбрасывает форму,
   * устанавливает состояние App.setState( 'user-logged' ) и
   * закрывает окно, в котором находится форма
   * */
  onSubmit(data) {
    User.login(data, response => {

      if (response.success) {
        App.getForm('login').element.reset();
        App.setState('user-logged');
        App.getModal('login').close();
      } else {
        App.getForm('login').element.reset();
        showLoginError();

        function showLoginError() {
          let div = document.createElement('div');
          div.className = 'error';
          div.innerHTML = response.error;
          App.getForm('login').element.append(div);
        }
      }

    });
  }
}