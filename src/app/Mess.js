export default class Mess {
  constructor(id, user, date, text, you) {
    this.id = id;
    this.user = user;
    this.date = date;
    this.text = text;
    this.you = you;
  }

  view() {
    const mess = document.createElement('div');
    const messInfo = document.createElement('div');
    messInfo.classList = 'messInfo';
    const messText = document.createElement('div');
    messText.classList = 'messText';
    let author;

    if (this.you) {
      mess.classList = 'myMess';
      messInfo.classList.toggle('you');
      author = 'You';
    } else {
      mess.classList = 'mess';
      author = this.user;
    }

    messInfo.textContent = `${author}, ${this.date}`;
    messText.textContent = this.text;
    [messInfo, messText].forEach((el) => { mess.appendChild(el); });

    return {
      newMess: mess, id: this.id, user: this.user, date: this.date, text: this.text,
    };
  }
}
