const express = require('express');
const path = require('path');
const http = require('http');
const socketio = require('socket.io');
const Filter = require('bad-words');
const toonavatar = require('cartoon-avatar');
const { createMessages } = require('./utils/create-messages');
const { getUserList, addUser, removeUser, findUser } = require('./utils/users');
const app = express();
const port = process.env.PORT || 8080;

const publicPathDirectory = path.join(__dirname, '../public');
app.use(express.static(publicPathDirectory));

//Create server
const server = http.createServer(app);

//Initialization socket server (connect sokectio with express)
const io = socketio(server);

//Listen event from client to server
io.on("connection", (socket) => {
    socket.on("join room from client to server", ({ username, room }) => {
        socket.join(room);

        //Send message to client just visited
        socket.emit("send message chat from server to client", createMessages(`Welcome to room ${room}!`, "/images/avatar-admin.png"));

        //Send message to client other client just visited
        socket.broadcast.to(room).emit("send message chat from server to client", createMessages(`${username} just joined the room`, "/images/avatar-admin.png"));

        //Create avatar random 
        const avatar = toonavatar.generate_avatar();

        //Check bad words
        const filter = new Filter();

        //Chat
        socket.on("send message chat from client to server", (messageText, callback) => {
            filter.addWords('dm', 'đm', 'dmm', 'đmm', 'cc', 'qq');
            if (filter.isProfane(messageText))
                return callback("The message is not yet profanity!");
            const userList = getUserList();
            const indexUser = userList.findIndex(user => user.id === socket.id);
            if (indexUser) {
                socket.emit("send message userself chat from server to client", createMessages(messageText, avatar));
                socket.broadcast.to(room).emit("send message chat from server to client", createMessages(messageText, avatar));
            } else {
                io.to(room).emit("send message chat from server to client", createMessages(messageText, avatar));
            }
            callback();
        });

        //Handle share location 
        socket.on("share location from client to server", ({ latitude, longitude }) => {
            // const linkLocation = `https://www.google.com/maps?q=${latitude},${longitude}`;
            const userList = getUserList();
            const indexUser = userList.findIndex(user => user.id === socket.id);
            if (indexUser) {
                socket.emit("share userself location from server to client", createMessages({ latitude, longitude }, avatar));
                socket.broadcast.to(room).emit("share location from server to client", createMessages({ latitude, longitude }, avatar));
            } else {
                io.to(room).emit("share location from server to client", createMessages({ latitude, longitude }, avatar));
            }
        })

        //Handle user list
        const newUser = {
            id: socket.id,
            avatar,
            username,
            room,
        }
        socket.emit("send the user who just joined the chat room from server to client", newUser);
        addUser(newUser);
        io.to(room).emit("send user list from server to client", getUserList(room));

        //Disconnect client with server
        socket.on("disconnect", () => {
            removeUser(socket.id);
            io.to(room).emit("send user list from server to client", getUserList(room));
        })
    });
})

server.listen(port, () => {
    console.log(`App listening at http://localhost:${port}`);
})