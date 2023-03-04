import { v4 as uuidv4 } from 'uuid';
import Mess from './Mess.js';
import Time from './Time.js';
// import { v4 as uuidv4 } from 'https://jspm.dev/uuid';

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

    this.messages.forEach((message) => {
      const mess = new Mess(message.id, message.user, message.date, message.text, false);
      scrollBar.appendChild(mess.view().newMess);
      document.querySelector('.scrollBar').lastElementChild.scrollIntoView({ block: 'end' });
    });

    chatStr.addEventListener('change', (event) => {
      const myMess = new Mess(
        uuidv4(),
        this.currentUser,
        Time(new Date()),
        event.target.value,
        true,
      );
      scrollBar.appendChild(myMess.view().newMess);
      event.target.value = '';
      document.querySelector('.scrollBar').lastElementChild.scrollIntoView({ block: 'end' });

      const ws = new WebSocket('ws://localhost:8080/ws');
      const data = {
        id: myMess.view().id,
        user: myMess.view().user,
        date: myMess.view().date,
        text: myMess.view().text,
      };
      ws.addEventListener('message', () => {
        ws.send(JSON.stringify({ type: 'newMsg', data }));
        ws.close();
      });
    });

    const sideBar = document.createElement('div');
    sideBar.classList = 'sideBar';
    document.body.appendChild(sideBar);

    const ulList = document.createElement('ul');
    const users = this.users.map((n) => {
      if (n === this.currentUser) {
        return 'You';
      }
      return n;
    });
    users.forEach((element) => {
      const user = document.createElement('li');
      user.textContent = element;
      ulList.appendChild(user);
      if (element === 'You') {
        user.classList = 'you';
      }
    });
    sideBar.appendChild(ulList);
  }

  deleteUser(user) {
    const users = document.querySelector('ul');
    users.childNodes.forEach((el) => {
      if (el.textContent === user) {
        el.remove();
      }
    });
  }
}
