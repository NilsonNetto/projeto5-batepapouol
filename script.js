
let username;
let messageTo = "Todos";
let messageType = "message";
let nameObj;
let messageObj;
let oldLastMessage;
let newLastMessage;
let participantsInterval;


let inputMessageSelect = document.querySelector('.input');
inputMessageSelect.addEventListener('keypress', function (event) {
  if (event.key === "Enter") {
    event.preventDefault();
    document.querySelector('.send-message').click();
  }
});

let inputNameSelect = document.querySelector('.login-name');
inputNameSelect.addEventListener('keypress', function (event) {
  if (event.key === "Enter") {
    event.preventDefault();
    document.querySelector('.login-button').click();
  }
});

document.querySelector('.login-name').value = '';

function askName() {
  username = document.querySelector('.login-name').value;
  nameObj = {
    name: username
  }
  loadingToggle();
  joinRoom();
  clearInput();
}

function loadingToggle() {
  document.querySelector('.login-name').classList.toggle('hide');
  document.querySelector('.login-button').classList.toggle('hide');
  document.querySelector('.loading').classList.toggle('hide');
}

function joinRoom() {
  let promisse = axios.post('https://mock-api.driven.com.br/api/v6/uol/participants', nameObj);

  promisse.then(joinedRoom);
  promisse.catch(joinError);
}

function joinedRoom() {
  document.querySelector('.login-page').classList.add('hide');
  console.log('entrou')
  setInterval(statusConnected, 5000);
  receiveMessages()
  setInterval(receiveMessages, 3000);
}

function joinError(error) {
  if (error.request.status === 400) {
    alert("Este nome já está em uso, por favor escolha outro nome")
    loadingToggle();
    document.querySelector('.login-name').value = '';
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
      if (messages.data[i].from === username || messages.data[i].to === username) {
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
  }
  scrollToLastMessage();
}

function sendMessage() {
  let writeMessage = document.querySelector('.message-write').value.trim();
  if (writeMessage !== '') {
    messageObj = {
      from: username,
      to: messageTo,
      text: writeMessage,
      type: messageType
    }
    clearInput();
    uploadMessage();
  }
}

function clearInput() {
  document.querySelector('.message-write').value = '';
}

1
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
  let lastMessage = document.querySelectorAll('.message');
  newLastMessage = lastMessage[lastMessage.length - 1].innerHTML;
  if (newLastMessage !== oldLastMessage) {
    lastMessage[lastMessage.length - 1].scrollIntoView();
    oldLastMessage = newLastMessage;
  }
}

function showSidebar() {
  let sidebar = document.querySelector('.sidebar');
  let darkBackground = document.querySelector('.dark-background');
  sidebar.classList.remove('hide');
  darkBackground.classList.remove('hide');
  getParticipants()
  participantsInterval = setInterval(getParticipants, 10000);
}

function hideSidebar() {
  let sidebar = document.querySelector('.sidebar');
  let darkBackground = document.querySelector('.dark-background');
  sidebar.classList.add('hide');
  darkBackground.classList.add('hide');
  clearInterval(participantsInterval);
}

function getParticipants() {
  promisse = axios.get('https://mock-api.driven.com.br/api/v6/uol/participants');
  promisse.then(showParticipants);
}

function showParticipants(participants) {
  console.log('atualizando participants')
  let participantsList = document.querySelector('.participants-list');
  participantsList.innerHTML = '';
  for (let i = 0; i < participants.data.length; i++) {
    participantsList.innerHTML += `
    <div class="person" onclick="selectParticipant(this)">
    <ion-icon name="person-circle"></ion-icon>
    <span>${participants.data[i].name}</span>
  </div>`
  }
}

function selectParticipant(element) {
  const participantSelected = element.querySelector('span').innerHTML;
  console.log(participantSelected);
  messageTo = participantSelected;
  document.querySelector('.message-to').innerHTML = messageTo;
}

function messageVisibility(element) {
  const messageVisibility = element.querySelector('span').innerHTML;
  console.log(messageVisibility);
  if (messageVisibility === "Público") {
    messageType = "message";
  } else {
    messageType = "private_message";
  }
  document.querySelector('.visibility').innerHTML = ` (${messageVisibility})`;
}