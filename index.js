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

io.on('connection', (socket) => {
    console.log('a user connected');
});


server.listen(3000, () => {
    console.log('listening on *:3000');
})