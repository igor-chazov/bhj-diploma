/**
 * Класс CreateTransactionForm управляет формой
 * создания новой транзакции
 * */
class CreateTransactionForm extends AsyncForm {
  /**
   * Вызывает родительский конструктор и
   * метод renderAccountsList
   * */
  constructor(element) {
    super(element);
    this.renderAccountsList();
  }

  /**
   * Получает список счетов с помощью Account.list
   * Обновляет в форме всплывающего окна выпадающий список
   * */
  renderAccountsList() {
    Account.list(null, response => {

      if (response.success === true) {

        if (this.element.matches('#new-income-form')) {

          for (let elem of this.element.querySelectorAll('select > option')) {
            if (elem) elem.remove();
          }

        }

        if (this.element.matches('#new-expense-form')) {

          for (let elem of this.element.querySelectorAll('select > option')) {
            if (elem) elem.remove();
          }

        }

        for (let i = 0; i < Array.from(response.data).length; i++) {
          const option = document.createElement("option");
          option.value = response.data[i].id;
          option.text = response.data[i].name;

          if (this.element.matches('#new-income-form')) {
            this.element.querySelector('#income-accounts-list').append(option);
          }

          if (this.element.matches('#new-expense-form')) {
            this.element.querySelector('#expense-accounts-list').append(option);
          }

        }
      }
    });
  }

  /**
   * Создаёт новую транзакцию (доход или расход)
   * с помощью Transaction.create. По успешному результату
   * вызывает App.update(), сбрасывает форму и закрывает окно,
   * в котором находится форма
   * */
  onSubmit(data) {
    Transaction.create(data);
    this.element.reset();
  }
}