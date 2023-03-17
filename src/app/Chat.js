import Mess from './Mess.js';

export default class Chat {
  constructor(users, messages, currentUser) {
    this.users = users;
    this.messages = messages;
    this.currentUser = currentUser;
  }

  create() {
    const chatWindow = document.createElement('div');
    chatWindow.classList = 'chatWindow';
    document.body.appendChild(chatWindow);

    const scrollBar = document.createElement('div');
    scrollBar.classList = 'scrollBar';
    chatWindow.appendChild(scrollBar);

    const chatStr = document.createElement('input');
    chatStr.placeholder = 'Type your message here';
    chatStr.classList = 'chatStr';
    scrollBar.appendChild(chatStr);

    if (this.messages) {
      this.messages.forEach((message) => {
        const mess = new Mess(message.id, message.user, message.date, message.text, false);
        scrollBar.appendChild(mess.view().newMess);
        document.querySelector('.scrollBar').lastElementChild.scrollIntoView({ block: 'end' });
      });
    }

    const sideBar = document.createElement('div');
    sideBar.classList = 'sideBar';
    document.body.appendChild(sideBar);

    const ulList = document.createElement('ul');
    ulList.classList = 'usersList';
    this.users.forEach((element) => {
      const user = document.createElement('li');
      user.name = element;
      if (element === this.currentUser) {
        user.textContent = 'You';
        user.classList = 'you';
      } else {
        user.textContent = element;
      }
      ulList.appendChild(user);
    });
    sideBar.appendChild(ulList);
  }
}
