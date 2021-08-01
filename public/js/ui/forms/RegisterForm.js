/**
 * Класс RegisterForm управляет формой
 * регистрации
 * */
class RegisterForm extends AsyncForm {
  /**
   * Производит регистрацию с помощью User.register
   * После успешной регистрации устанавливает
   * состояние App.setState( 'user-logged' )
   * и закрывает окно, в котором находится форма
   * */
  onSubmit(data) {
    User.register(data, response => {

      if (response.success) {
        App.getForm('register').element.reset();
        App.setState('user-logged');
        App.getModal('register').close();
      } else {
        App.getForm('register').element.reset();
        showLoginError();

        function showLoginError() {
          let div = document.createElement('div');
          div.className = 'error';
          div.innerHTML = response.error;
          App.getForm('register').element.append(div);
        }
      }
    });
  }
}