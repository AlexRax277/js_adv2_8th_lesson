export default class EnterPop {
  constructor(name) {
    this.name = name;
  }

  create() {
    const popup = document.createElement('form');
    popup.classList = 'popup';
    popup.textContent = this.name;
    document.body.appendChild(popup);

    const userName = document.createElement('input');
    userName.required = true;
    userName.type = 'text';
    popup.appendChild(userName);

    const submit = document.createElement('button');
    submit.textContent = 'Продолжить';
    popup.appendChild(submit);

    return { popup, submit, userName };
  }
}
