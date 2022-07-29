const express = require('express');
const app = express();
const path = require('path');
const bodyParser = require('body-parser');
const http = require('http');
const socketio = require('socket.io');
const formatMessage = require('./public/utils/mensajes');
const { userJoin, getCurrentUser, userleave, getRoomUsers  } = require('./public/utils/usuarios');
const server = http.createServer(app);


const io = socketio(server);

app.use(express.static(path.join(__dirname, 'public')));

const bot = 'ErisBot';

io.on('connection', (socket) => {

    socket.on('joinRoom', ({ username, room }) => {

        const user = userJoin(socket.id, username, room);

        socket.join(user.room);

        socket.emit('message', formatMessage(bot, `${user.username} se ha unido a la sala`));

        io.to(user.room).emit('roomUsers', {
            room: user.room,
            users: getRoomUsers(user.room)
        })

        socket.broadcast.to(user.room).emit('message',formatMessage(bot, 'Bienvenido a la sala'));

        socket.on('disconnect', () => {

            const user = userleave(socket.id);

            if(user){
                io.to(user.room).emit('message', formatMessage(bot, `${user.username} se ha desconectado`));
            }

            io.to(user.room).emit('roomUsers', {
                room: user.room,
                users: getRoomUsers(user.room)
            })
        });
    })

    

    socket.on('chatMessage', msg => {
        const user = getCurrentUser(socket.id);
        io.to(user.room).emit('message', formatMessage(user.username, msg));
    })
})


server.listen(3000, () => {
    console.log('Server alojado en el puerto 3000');
})