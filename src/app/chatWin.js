import { v4 as uuidv4 } from 'uuid';
import ReconnectingWebSocket from 'reconnecting-websocket/dist/reconnecting-websocket.mjs';
// import { v4 as uuidv4 } from 'https://jspm.dev/uuid';
// import ReconnectingWebSocket from './reconnecting-websocket/dist/reconnecting-websocket.mjs';
import Chat from './Chat.js';
import Time from './Time.js';
import Mess from './Mess.js';

export default function chatWin() {
  const ws = new ReconnectingWebSocket('ws://localhost:8080');
  const currentUser = localStorage.getItem('currentUser');
  ws.send(JSON.stringify({ type: 'chatReq', data: '' }));
  ws.onopen = (() => {
    console.log('connection is open');
  });

  ws.onmessage = (event) => {
    const data = JSON.parse(event.data);
    if (data.type === 'chatReq' && !document.querySelector('.chatWindow')) {
      const { usersOnline } = data.data;
      const { messages } = data.data;
      const chat = new Chat(usersOnline, messages, currentUser);
      chat.create();
      document.querySelector('.scrollBar').lastElementChild.scrollIntoView({ block: 'end' });

      window.addEventListener('beforeunload', () => {
        ws.send(JSON.stringify({ type: 'userOut', data: currentUser }));
      });
    } else if (data.type === 'currentUserList') {
      const usersList = document.querySelector('.usersList');
      const currentUserList = data.data.usersOnline;
      currentUserList.forEach((element) => {
        if (!(Array.from(usersList.childNodes).map((el) => el.name)).includes(element)) {
          const newUser = document.createElement('li');
          newUser.name = element;
          newUser.textContent = element;
          usersList.appendChild(newUser);
        }
      });
      Array.from(usersList.childNodes).forEach((element) => {
        if (!currentUserList.includes(element.name)) {
          element.remove();
        }
      });

      const scrollBar = document.querySelector('.scrollBar');
      const currentChat = data.data.messages;

      currentChat.forEach((element) => {
        if (!(Array.from(scrollBar.childNodes)
          .filter((e) => e.nodeName !== 'INPUT')
          .map((el) => el.id)).includes(element.id)) {
          const newMess = new Mess(
            element.id,
            element.user,
            element.date,
            element.text,
            false,
          );
          scrollBar.appendChild(newMess.view().newMess);
          scrollBar.lastElementChild.scrollIntoView({ block: 'end' });
        }
      });
    }

    document.querySelector('.chatStr').addEventListener('change', (ev) => {
      const myMess = new Mess(
        uuidv4(),
        currentUser,
        Time(new Date()),
        ev.target.value,
        true,
      );
      const newMsg = myMess.view();
      ev.target.value = '';
      const dataMsg = {
        id: newMsg.id,
        user: newMsg.user,
        date: newMsg.date,
        text: newMsg.text,
      };
      if (newMsg.text) {
        document.querySelector('.scrollBar').appendChild(newMsg.newMess);
        document.querySelector('.scrollBar').lastElementChild.scrollIntoView({ block: 'end' });
        ws.send(JSON.stringify({ type: 'newMsg', data: dataMsg }));
      }
    });
  };

  ws.close = (() => {
    console.log('connection is closed');
  });
}
