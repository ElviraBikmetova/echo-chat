// Задание 3.
// Реализовать чат на основе эхо-сервера wss://echo-ws-service.herokuapp.com.
// Интерфейс состоит из input, куда вводится текст сообщения, и кнопки «Отправить».
// При клике на кнопку «Отправить» сообщение должно появляться в окне переписки.
// Эхо-сервер будет отвечать вам тем же сообщением, его также необходимо выводить в чат:
// Добавить в чат механизм отправки гео-локации:
// При клике на кнопку «Гео-локация» необходимо отправить данные серверу и в чат вывести ссылку на https://www.openstreetmap.org/ с вашей гео-локацией. Сообщение, которое отправит обратно эхо-сервер, не выводить.

const wsUrl = "wss://echo-ws-service.herokuapp.com";
const btnSend = document.querySelector('.btn-send');
const btnGeo = document.querySelector('.btn-geo');
const chat = document.querySelector('.chat-window');
let div;
let p;
let a;
let websocket;

// Установка соединения WebSocket и обработка событий
websocket = new WebSocket(wsUrl);
websocket.onopen = function() {
  displayServerM("Соединение открыто");
};
websocket.onclose = function() {
  displayServerM("Соединение закрыто");
};
websocket.onerror = function(evt) {
  displayServerM('<span style="color: red;">Ошибка:</span> ' + evt.data);
};
websocket.onmessage = function(evt) {
  displayServerM(evt.data);
};

// Формирование сообщения
function makeMessage() {
  div = document.createElement("div");
  p = document.createElement("p");
  chat.appendChild(div);
  div.appendChild(p);
  p.classList.add("message");
}

// Сообщения от клиента
function displayClientM(message) {
  makeMessage();
  p.innerHTML = message;
  div.classList.add("message-client");
}

// Системные сообщения и от сервера
function displayServerM(message) {
  makeMessage();
  p.innerHTML = message;
  div.classList.add("message-server");
}

// Обработка кнопки "Отправить"
btnSend.addEventListener('click', () => {
  let message = document.querySelector("input").value;
  if (message == '') {
    displayServerM('Пустое сообщение')
  } else {
    websocket.send(message);
    displayClientM(message);
  }
});

// Формирование сообщения о геопозиции
function displayGeo() {
  makeMessage();
  a = document.createElement("a");
  p.appendChild(a);
  div.classList.add("message-client");
  a.setAttribute('target','_blank');
}

// Вывод сообщения, если пользователь скрыл геопозицию
const error = () => {
  displayServerM("Невозможно получить ваше местоположение");
}

// Вывод геопозиции
const success = (position) => {
  displayGeo();
  a.href = '';
  a.textContent = '';
  const latitude  = position.coords.latitude;
  const longitude = position.coords.longitude;
  a.href = `https://www.openstreetmap.org/#map=18/${latitude}/${longitude}`;
  a.textContent = 'Гео-локация';
}

// Обработка кнопки "Гео-локация"
btnGeo.addEventListener('click', () => {
  if (!navigator.geolocation) {
     displayServerM('Geolocation не поддерживается вашим браузером');
  } else {
    navigator.geolocation.getCurrentPosition(success, error);
  }
});