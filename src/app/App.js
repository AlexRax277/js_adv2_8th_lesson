import EnterPop from './EnterPop.js';

export default async function MainFoo() {
  const pop = new EnterPop('Выберите псевдоним');
  const { submit, userName } = pop.create();
  
  const ws = new WebSocket('ws://localhost:8080');
  
  ws.onopen = (() => {
    console.log('isopen');
    ws.send(JSON.stringify({ "type": "initialData", "data": '' }))
  });

  ws.onmessage = ((e) => { 
    const msg = JSON.parse(e.data);
    if(msg.type === 'initialData') {
      let allUsers = msg.data;
      submit.addEventListener('click', e => {
        e.preventDefault();
        const currentUser = userName.value;
        localStorage.setItem('currentUser', currentUser);
        if (!allUsers.includes(currentUser) && currentUser.length > 1 && currentUser.length <= 10) {
          ws.send(JSON.stringify({ "type": "userEnter", "data": currentUser }));
          setInterval(() => {
            window.location.href = String(window.location.href).replace('index', 'chat');
          }, 1 * 1000);
        } else {
          alert('Такое имя уже существует либо введенное имя слишком длинное/короткое, введите другое.');
        };
      });
    };
  })

  ws.onclose = (() => {
    console.log('isclosed');
  });
};
