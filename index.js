const express = require('express');
const app = express();
const http = require('http');
const { isObject } = require('util');
const server = http.createServer(app);

const { Server } = require('socket.io');
const io = new Server(server);

/*

app.get('/', (req, res) => {
    res.send('<h1>Hello world</h1>');
});

*/
app.use('/socket.io', express.static('./node_modules/socket.io/client-dist/'))

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/index.html');
});

io.on('connection', (socket) => {// perform tasks when connection is established
    console.log('a user connected');// log the console once connected

    /*
    // log the chat message to the console
    socket.on('chat message', (msg) => {
        console.log('message:' + msg);
    });
    */
    
    // send the message to everyone (including the sender)
    io.on('connection', (socket) => {
        socket.on('chat message', (msg) => {
            console.log('message:' + msg);
            io.emit('chat message', msg);
        });
    })

    // log the console if the socket disconnects
    socket.on('disconnect', () => {
        console.log('user disconnected');
    });
});





server.listen(3000, () => {// listen on port 3000
    console.log('listening on *:3000');
});