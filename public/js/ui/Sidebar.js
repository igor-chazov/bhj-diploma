/**
 * Класс Sidebar отвечает за работу боковой колонки:
 * кнопки скрытия/показа колонки в мобильной версии сайта
 * и за кнопки меню
 * */
class Sidebar {
  /**
   * Запускает initAuthLinks и initToggleButton
   * */
  static init() {
    this.initAuthLinks();
    this.initToggleButton();
  }

  /**
   * Отвечает за скрытие/показа боковой колонки:
   * переключает два класса для body: sidebar-open и sidebar-collapse
   * при нажатии на кнопку .sidebar-toggle
   * */
  static initToggleButton() {
    (document.querySelector('.sidebar-toggle')).addEventListener('click', (event) => {
      event.preventDefault();
      const { target } = event;
      App.element.classList.toggle('sidebar-open');

      if (target.closest('.sidebar-open')) {
        App.element.classList.add('.sidebar-collapse');
      } else {
        App.element.classList.remove('.sidebar-collapse');
      }

    });
  }

  /**
   * При нажатии на кнопку входа, показывает окно входа
   * (через найденное в App.getModal)
   * При нажатии на кнопку регастрации показывает окно регистрации
   * При нажатии на кнопку выхода вызывает User.logout и по успешному
   * выходу устанавливает App.setState( 'init' )
   * */
  static initAuthLinks() {
    document.querySelector('.menu-item_login').addEventListener('click', (event) => {
      event.preventDefault();
      App.getModal('login').open();
      /* Удаление сообщения об ошибке ввода регистрационных данных в форме "login" */
      if (App.getForm('login').element.lastElementChild.matches('.error')) {
        App.getForm('login').element.lastElementChild.remove();
      }

      App.getForm('login').element.reset();
    });

    document.querySelector('.menu-item_register').addEventListener('click', (event) => {
      event.preventDefault();
      App.getModal('register').open();
      /* Удаление сообщения об ошибке ввода регистрационных данных в форме "register" */
      if (App.getForm('register').element.lastElementChild.matches('.error')) {
        App.getForm('register').element.lastElementChild.remove();
      }

      App.getForm('register').element.reset();
    });

    document.querySelector('.menu-item_logout').addEventListener('click', (event) => {
      event.preventDefault();
      User.logout(response => {

        if (response.success) {
          App.setState('init');
        }

      });
    });
  }
}