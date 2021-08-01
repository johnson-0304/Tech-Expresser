//const user = require("../../models/user");

const messageForm = document.getElementById("message-form");
const messages = document.getElementById("messages");
const userList = document.getElementById("user-list");

const username = $(".sku-info").text();

const socket = io();

socket.emit("joinRoom", { username });

//get users
socket.on("roomUsers", ({ users }) => {
  outputUsers(users);
  console.log(users);
});

//  = $("username").text();
console.log(username + "connected");

//message from server
socket.on("message", (message) => {
  console.log(message);
  //outputMessage3(message);

  //message by self
  if (message.username === username) {
    outputMessage1(message);
  } else if (message.username == "Chat Bot") {
    outputMessage3(message);
  } else {
    outputMessage2(message);
  }

  //scroll down
  messages.scrollTop = messages.scrollHeight;
});

//message submit
messageForm.addEventListener("submit", (e) => {
  e.preventDefault();

  const msg = e.target.elements.msg.value;

  //emit message to server
  socket.emit("chatMessage", msg);

  e.target.elements.msg.value = "";
  e.target.elements.msg.focus();
});

//output message to dom
//output for self
function outputMessage1(message) {
  const div = document.createElement("div");
  div.classList.add("message");
  div.innerHTML = ` <div class="body-wrap col l12">
  <div class="message-box-r ">
    <p class='meta-r orange-text lighten-1'>${message.username}<span>&nbsp ${message.time}</span></p>
    <p class="message-text-r">
      ${message.text}
    </p>
  </div>
</div>`;

  messages.appendChild(div);
}

//output from other user
function outputMessage2(message) {
  const div = document.createElement("div");
  div.classList.add("message");
  div.innerHTML = ` <div class="body-wrap col l12">
  <div class="message-box-l ">
    <p class='meta orange-text lighten-1'>${message.username}<span>&nbsp ${message.time}</span></p>
    <p class="message-text-r">
      ${message.text}
    </p>
  </div>
</div>`;

  messages.appendChild(div);
}

//output from system
function outputMessage3(message) {
  const div = document.createElement("div");
  div.classList.add("message");
  div.innerHTML = ` <div class="body-wrap col l12">
  <div class="message-box-b ">
    <p class='meta-b orange-text lighten-1'>${message.username}<span>&nbsp ${message.time}</span></p>
    <p class="message-text-b">
      ${message.text}
    </p>
  </div>
</div>`;

  messages.appendChild(div);
}

$("#msg").keydown(function (e) {
  if (event.keyCode == "13" && event.shiftKey == "1") {
    e.value = e.value + "/n";
    return;
  }

  if (e.keyCode == 13) {
    $("#submitBtn").click();
  }
});

//add users to dom

function outputUsers(users) {
  userList.innerHTML = `
    ${users.map((user) => `<li>${user.username}</li>`).join("")}
  `;
}
