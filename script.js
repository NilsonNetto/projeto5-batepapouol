
let userName;
let nameObj;
let messageObj;
let oldLastMessage;
let newLastMessage;

askName();

function askName() {
  userName = prompt('Qual é o seu nome?');
  nameObj = {
    name: userName
  }
  joinRoom();
}


function joinRoom() {
  let promisse = axios.post('https://mock-api.driven.com.br/api/v6/uol/participants', nameObj);

  promisse.then(joinedRoom);
  promisse.catch(joinError);
}

function joinedRoom() {
  console.log('entrou')
  setInterval(statusConnected, 5000);
  receiveMessages()
  setInterval(receiveMessages, 3000);
}

function joinError(error) {
  if (error.request.status === 400) {
    alert("Este nome já está em uso, por favor escolha outro nome")
    askName()
  }
}


function statusConnected() {
  let promisse = axios.post('https://mock-api.driven.com.br/api/v6/uol/status', nameObj);
}

function receiveMessages() {
  let promisse = axios.get('https://mock-api.driven.com.br/api/v6/uol/messages');
  promisse.then(showMessages);
  promisse.catch();
}

function showMessages(messages) {
  let messageArea = document.querySelector('.chat');
  messageArea.innerHTML = '';
  for (let i = 0; i < messages.data.length; i++) {
    if (messages.data[i].type === 'status') {
      messageArea.innerHTML += `
      <div class="message status">
        <p>
          <span class="time">(${messages.data[i].time}) </span>
          <span class="name"> ${messages.data[i].from} </span>
          <span class="text">${messages.data[i].text}</span>
        </p>
      </div>
      `;
    } else if (messages.data[i].type === 'message') {
      messageArea.innerHTML += `
      <div class="message">
        <p>
          <span class="time">(${messages.data[i].time}) </span>
          <span class="name">${messages.data[i].from} </span> para
          <span class="name">${messages.data[i].to}:</span>
          <span class="text">${messages.data[i].text}</span>
        </p>
      </div>
      `;
    } else if (messages.data[i].type === 'private_message') {
      if (messages.data[i].from === userName || messages.data[i].to === userName) {
        messageArea.innerHTML += `
        <div class="message private">
          <p>
            <span class="time">(${messages.data[i].time}) </span>
            <span class="name">${messages.data[i].from} </span> para
            <span class="name">${messages.data[i].to}:</span>
            <span class="text">${messages.data[i].text}</span>
          </p>
        </div>
        `;
      } else {

      }
    }
    scrollToLastMessage();
  }
}

function sendMessage() {
  let writeMessage = document.querySelector('.message-write').value;
  messageObj = {
    from: userName,
    to: "Todos",
    text: writeMessage,
    type: "message"
  }
  document.querySelector('.message-write').value = '';
  uploadMessage();
}

function uploadMessage() {
  let promisse = axios.post('https://mock-api.driven.com.br/api/v6/uol/messages', messageObj);
  promisse.then(messageUploaded);
  promisse.catch(uploadError);
}

function messageUploaded() {
  receiveMessages()
}

function uploadError() {
  alert('Sua mensagem não foi enviada, você foi desconectado do chat')
  window.location.reload();
}

function scrollToLastMessage() {
  let lastMessage = document.querySelectorAll('.time');
  newLastMessage = lastMessage[lastMessage.length - 1].innerHTML;
  if (newLastMessage !== oldLastMessage) {
    lastMessage[lastMessage.length - 1].scrollIntoView();
    oldLastMessage = newLastMessage;
  }
}

/* function enterClickForMessage(event) {
  if (event.keyCode === 13) {
    event.preventDefault();
    document.querySelector(".send-message").click();
  }
} */