/**
 * Класс TransactionsPage управляет
 * страницей отображения доходов и
 * расходов конкретного счёта
 * */
class TransactionsPage {
  lastOptions = null;
  /**
   * Если переданный элемент не существует,
   * необходимо выкинуть ошибку.
   * Сохраняет переданный элемент и регистрирует события
   * через registerEvents()
   * */
  constructor(element) {

    if (!element) {
      throw Error('Элемент не найден');
    }

    this.element = element;
    this.registerEvents();
  }

  /**
   * Вызывает метод render для отрисовки страницы
   * */
  update() {
    this.render(this.lastOptions);
  }

  /**
   * Отслеживает нажатие на кнопку удаления транзакции
   * и удаления самого счёта. Внутри обработчика пользуйтесь
   * методами TransactionsPage.removeTransaction и
   * TransactionsPage.removeAccount соответственно
   * */
  registerEvents() {
    this.element.addEventListener('click', (event) => {
      event.preventDefault();
      const { target } = event;

      if (target.closest('.remove-account')) {
        if (document.querySelector('.content-title').textContent === 'Название счёта') return;
        this.removeAccount();
      }

      if (target.closest('.transaction__remove')) {
        this.removeTransaction(target.closest('.transaction__remove').dataset.id);
      }

    });
  }

  /**
   * Удаляет счёт. Необходимо показать диаголовое окно (с помощью confirm())
   * Если пользователь согласен удалить счёт, вызовите
   * Account.remove, а также TransactionsPage.clear с
   * пустыми данными для того, чтобы очистить страницу.
   * По успешному удалению необходимо вызвать метод App.updateWidgets(),
   * либо обновляйте только виджет со счетами
   * для обновления приложения
   * */
  removeAccount() {
    showModal(this.element);

    function showModal(element) {
      let div = document.createElement('div');
      div.className = 'modal';
      div.id = 'modal';
      div.style.cssText = `display: flex;
      justify-content: center;
      align-items: center;
      position: fixed;
      left: 0;
      top: 0;
      right: 0;
      bottom: 0;
      background: rgba(0, 0, 0, 0.5);
      user-select: none
      ;`
      div.innerHTML = `
      <div class="modal__content" style=" background-color: #fff; padding: 10px; border-radius: 5px">
        <div class="modal__header">
          <div class="modal__title" style="font-size: 20px; padding-bottom: 20px; border-bottom: 1px solid grey">Вы действительно хотите удалить счёт?</div>
        </div>
        <div class="modal__footer" style="display: flex; justify-content: flex-end; padding-top: 10px; color: blue; font-weight: bold">
          <button class="modal__close" type="button" style="border: none; padding-right: 20px" onclick="document.getElementById('modal').remove()">Отменить</button>
          <button class="modal__close" type="button" id="modal__closeOk" style="border: none" >ОК</button>
        </div>
      </div>`;

      element.prepend(div);
    }

    document.getElementById('modal__closeOk').addEventListener('click', () => {

      if (!document.querySelector('#modal__closeOk')) return;

      document.getElementById('modal').remove();
      const name = this.element.querySelector('.content-title').textContent;
      const { account_id } = this.lastOptions;
      Account.remove({ name: name, id: account_id }, response => {

        if (response.success) {
          App.updateWidgets();
        }

      })
      this.clear();
    });

  }

  /**
   * Удаляет транзакцию (доход или расход). Требует
   * подтверждеия действия (с помощью confirm()).
   * По удалению транзакции вызовите метод App.update(),
   * либо обновляйте текущую страницу (метод update) и виджет со счетами
   * */
  removeTransaction(id) {
    showModal(this.element);

    function showModal(element) {
      let div = document.createElement('div');
      div.className = 'modal';
      div.id = 'modal';
      div.style.cssText = `display: flex;
      justify-content: center;
      align-items: center;
      position: fixed;
      left: 0;
      top: 0;
      right: 0;
      bottom: 0;
      background: rgba(0, 0, 0, 0.5);
      user-select: none
      ;`
      div.innerHTML = `
      <div class="modal__content" style=" background-color: #fff; padding: 10px; border-radius: 5px">
        <div class="modal__header">
          <div class="modal__title" style="font-size: 20px; padding-bottom: 20px; border-bottom: 1px solid grey">Вы действительно хотите удалить эту транзакцию?</div>
        </div>
        <div class="modal__footer" style="display: flex; justify-content: flex-end; padding-top: 10px; color: blue; font-weight: bold">
          <button class="modal__close" type="button" style="border: none; padding-right: 20px" onclick="document.getElementById('modal').remove()">Отменить</button>
          <button class="modal__close" type="button" id="modal__closeOk" style="border: none" >ОК</button>
        </div>
      </div>`;

      element.prepend(div);
    }

    document.getElementById('modal__closeOk').addEventListener('click', () => {

      if (!document.querySelector('#modal__closeOk')) return;
      document.getElementById('modal').remove();
      Transaction.remove({ id: id }, response => {

        if (response.success) {
          this.update();
          App.update();
        }

      })
    });
  }

  /**
   * С помощью Account.get() получает название счёта и отображает
   * его через TransactionsPage.renderTitle.
   * Получает список Transaction.list и полученные данные передаёт
   * в TransactionsPage.renderTransactions()
   * */
  render(options) {

    if (!options) return;

    this.lastOptions = options;
    const { account_id } = this.lastOptions;
    Account.get(account_id, response => {

      if (response.success) {
        const { name } = response.data;
        this.renderTitle(name);
        Transaction.list(response.data, response => {

          if (response.success) {
            const { data } = response;
            this.renderTransactions(data);
          }

        });
      }

    });

  }

  /**
   * Очищает страницу. Вызывает
   * TransactionsPage.renderTransactions() с пустым массивом.
   * Устанавливает заголовок: «Название счёта»
   * */
  clear() {
    this.renderTransactions([]);
    this.renderTitle('Название счёта');
    this.lastOptions = null;
  }

  /**
   * Устанавливает заголовок в элемент .content-title
   * */
  renderTitle(name) {
    document.querySelector('.content-title').textContent = name;
  }

  /**
   * Форматирует дату в формате 2019-03-10 03:20:41 (строка)
   * в формат «10 марта 2019 г. в 03:20»
   * */
  formatDate(date) {
    let data = new Date(date);

    let day = data.getDate();
    let month = data.toLocaleString('default', { month: 'long' });
    let year = data.getFullYear();
    let hour = data.getHours();
    let minutes = data.getMinutes();

    day = day < 10 ? '0' + day : day;
    hour = hour < 10 ? '0' + hour : hour;
    minutes = minutes < 10 ? '0' + minutes : minutes;

    return `${day} ${month} ${year} г. в ${hour}:${minutes}`;
  }

  /**
   * Формирует HTML-код транзакции (дохода или расхода).
   * item - объект с информацией о транзакции
   * */
  getTransactionHTML(item) {
    const { created_at, id, name, sum, type } = item;

    return `
    <div class="transaction transaction_${type} row">
    <div class="col-md-7 transaction__details">
      <div class="transaction__icon">
          <span class="fa fa-money fa-2x"></span>
      </div>
      <div class="transaction__info">
          <h4 class="transaction__title">${name}</h4>
          <div class="transaction__date">${this.formatDate(created_at)}</div>
      </div>
    </div>
    <div class="col-md-3">
      <div class="transaction__summ">
        ${sum} <span class="currency">₽</span>
      </div>
    </div>
    <div class="col-md-2 transaction__controls">
      <button class="btn btn-danger transaction__remove" data-id="${id}">
        <i class="fa fa-trash"></i>  
      </button>
    </div>
</div>
    `;
  }

  /**
   * Отрисовывает список транзакций на странице
   * используя getTransactionHTML
   * */
  renderTransactions(data) {

    if (data.length === 0 || !!this.element.querySelector('.transaction')) {

      for (let elem of this.element.querySelectorAll('.transaction')) {
        elem.remove();
      }

    }

    for (let item of Array.from(data)) {
      this.element.querySelector('.content').insertAdjacentHTML('beforeend', this.getTransactionHTML(item));
    }

  }
}