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

    userConnectsMessage = "'A new user is connected!";
    socket.broadcast.emit('user connects', userConnectsMessage);
    /*
    // log the chat message to the console
    socket.on('chat message', (msg) => {
        console.log('message:' + msg);
    });
    */
    
    // send the message to everyone (including the sender)

    socket.on('chat message', (msg) => {
        console.log('message:' + msg);
        io.emit('chat message', msg);
    });

    socket.on('add username', async (username) => {
        socket.data.username = username;

        const sockets = await io.fetchSockets();

        console.log();
        console.log("Sockets connected: ");
        
        for(let i = 0; i < sockets.length; ++i) {
            console.log(`id: ${sockets[i].id} - username: ${sockets[i].data.username}`);
        }
    });
    
    // log the console if the socket disconnects
    socket.on('disconnect', () => {
        console.log('user disconnected');
        
        userDisconnectsMessage = "A user diconnects.";
        socket.broadcast.emit('user disconnects', userDisconnectsMessage);
    });
});





server.listen(3000, () => {// listen on port 3000
    console.log('listening on *:3000');
});