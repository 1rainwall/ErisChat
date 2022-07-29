const chatForm = document.getElementById('chat-form');
const chatMessages = document.querySelector('.chat-messages');
const { username, room } = Qs.parse(location.search, { ignoreQueryPrefix: true });
const roomName = document.getElementById('room-name');
const userList = document.getElementById('users');

const io = socket('https://eris-chat-git-main-1rainwall.vercel.app');



const socket = io();

socket.emit('joinRoom', { username, room });

socket.on('roomUsers', ({ users, room }) => {
    outputRoomName(room);
    outputUsersName(users);
})

socket.on('message', (message) => {
    console.log(message);
    outputMessage(message);

    chatMessages.scrollTop = chatMessages.scrollHeight;
    
});

chatForm.addEventListener('submit', (e) => {
    e.preventDefault();

    const msg = e.target.elements.msg.value;

    socket.emit('chatMessage', msg);

    e.target.elements.msg.value = '';
    e.target.elements.msg.focus();
});

function outputMessage(message){
    const div = document.createElement('div');
    div.classList.add('message');
    div.innerHTML = `<p class="meta"> ${message.username} <span> ${message.time} </span></p>
    <p class="text"> ${message.text} </p>`;

    document.querySelector('.chat-messages').appendChild(div);
}

function outputRoomName(room){

    roomName.innerText = room;
}

function outputUsersName(users){
    userList.innerHTML = `
    ${users.map(user => `<li>${user.username}</li>`).join('')}
    `;
}