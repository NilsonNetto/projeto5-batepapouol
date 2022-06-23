
let userName;
let nameObj;
let messageObj;

askName();

function askName(){
  userName = prompt('Qual é o seu nome?');
  nameObj = {
    name: userName
  }
  joinRoom();
}


function joinRoom (){
  let promisse = axios.post('https://mock-api.driven.com.br/api/v6/uol/participants', nameObj);

  promisse.then(joinedRoom);
  promisse.catch(joinError);
}



function joinedRoom(){
  console.log('entrou')
  setInterval(statusConnected, 5000);
  receiveMessages()
  //setInterval (receiveMessages, 3000);
}

function joinError(error){
  if (error.request.status === 400){
    alert ("Este nome já está em uso, por favor escolha outro nome")
    askName()
  }
}


function statusConnected(){
  let promisse = axios.post('https://mock-api.driven.com.br/api/v6/uol/status', nameObj);
  console.log('ainda estou ativo!')
}

function receiveMessages(){
  let promisse = axios.get('https://mock-api.driven.com.br/api/v6/uol/messages');
  promisse.then(showMessages);
  promisse.catch();
}

function showMessages(messages){
  let messageArea = document.querySelector('.messages');
  console.log(messages.data)
  for (let i=0; i < 100; i++){
    //aqui acho que faz um if, pra ver se é pra todos ou só pra privado
    //se for privado, mostra só se o username for igual, senão não
  if (messages.data[i].type === 'status'){
    messageArea.innerHTML += `<div class="status"><span class="time">(${messages.data[i].time}) </span> <span class="name"> ${messages.data[i].from} </span> ${messages.data[i].text}</div>`;
  } else if (messages.data[i].type === 'message'){
    messageArea.innerHTML +=  `<div class="message-all"><span class="time">(${messages.data[i].time}) </span> <span class="name">${messages.data[i].from} </span> para <span class="name">${messages.data[i].to}:</span> ${messages.data[i].text}</div>`;
  } else if (messages.data[i].type === 'private_message'){
    messageArea.innerHTML += 'esse é private';
  }
}
}

function sendMessage(){
  let writeMessage = document.querySelector('.message').value;
  messageObj = {
    from: userName,
    to: "Todos",
    text: writeMessage,
    type: "message"
  }
  document.querySelector('.message').value = '';
  uploadMessage();
}

function uploadMessage(){
  let promisse = axios.post('https://mock-api.driven.com.br/api/v6/uol/messages', messageObj);
  promisse.then(messageUploaded);
  promisse.catch(uploadError);
}

function messageUploaded(){
  console.log('a mensagem foi enviada')
}

function uploadError(){
  console.log('NÃO FOI ENVIADA')
}