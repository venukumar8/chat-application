// frontend/script.js
const socket = io('http://localhost:3000');

const username = localStorage.getItem('username');
if (!username) {
  window.location.href = 'login.html';
}

document.getElementById('userDisplay').textContent = username;

socket.emit('join', { username });

socket.on('private-message', ({ from, to, message }) => {
  if (from === username || to === username) {
    appendMessage(`[Private] ${from}: ${message}`);
  }
});

socket.on('group-message', ({ from, group, message }) => {
  appendMessage(`[Group] ${from}: ${message}`);
});

function sendMessage() {
  const message = document.getElementById('msgInput').value;
  const chatType = document.getElementById('chatType').value;
  const toUser = document.getElementById('toUser').value;

  if (!message.trim()) return;

  if (chatType === 'private') {
    socket.emit('private-message', {
      to: toUser,
      message
    });
  } else {
    socket.emit('group-message', {
      group: 'general',
      message
    });
  }

  document.getElementById('msgInput').value = '';
}
function logout() {
  localStorage.removeItem("token");
  localStorage.removeItem("username");
  window.location.href = "login.html";
}

function appendMessage(msg) {
  const li = document.createElement('li');
  li.textContent = msg;
  document.getElementById('messages').appendChild(li);
}
document.getElementById("logoutBtn").addEventListener("click", () => {
  localStorage.removeItem("username");  // Clear session
  window.location.href = "login.html"; // Redirect to login page
});