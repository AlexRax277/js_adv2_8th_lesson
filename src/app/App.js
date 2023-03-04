import EnterPop from './EnterPop.js';
import Chat from './Chat.js';

export default function MainFoo() {
  const pop = new EnterPop('Выберите псевдоним');
  const { popup, submit, userName } = pop.create();
  let allUsers = [];
  let currentUser;

  const ws = new WebSocket('ws://localhost:8080/ws');

  ws.onmessage = async function (e) {
    const data = await JSON.parse(e.data);
    const messages = data.chat;
    const { usersOnline } = data;

    messages.forEach((message) => {
      allUsers.push(message.user);
    });

    allUsers = [...allUsers, ...usersOnline];

    submit.addEventListener('click', (event) => {
      event.preventDefault();
      if (!allUsers.includes(userName.value)
      && userName.value.length > 1 && userName.value.length <= 10) {
        currentUser = userName.value;
        allUsers.push(currentUser);
        const chat = new Chat([...usersOnline, currentUser], messages, currentUser);
        ws.send(JSON.stringify({ type: 'userEnter', data: currentUser }));
        window.addEventListener('beforeunload', (ev) => {
          ev.preventDefault();
          ev.returnValue = '';
          const newWs = new WebSocket('ws://localhost:8080/ws');
          newWs.onopen = function () {
            newWs.send(JSON.stringify({ type: 'userOut', data: currentUser }));
          };
          chat.deleteUser(userName.value);
        });
        popup.remove();
        chat.create();
        document.querySelector('.scrollBar').lastElementChild.scrollIntoView({ block: 'end' });
      } else {
        alert('Такое имя уже существует либо введенное имя слишком длинное/короткое, введите другое.');
      }
    });
  };
}
