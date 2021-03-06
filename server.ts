import {routing} from "./modules/routing";
import {acceptCors} from "./helpers/acceptCors";
import {acceptOptions} from "./helpers/acceptOptions";

const http = require('http');
const net = require('net');


const PORT = 8001;

const httpServer = http.createServer((req, res) => {
    if(req.method === 'OPTIONS') {
        acceptOptions(req, res);
    } else {
        acceptCors(req, res);
        routing(req, res);
    }
});

const server = net.createServer((req) => {
//console.log('PROXY NET ADDRESS =>', req.address(), "REMOTE ADDRESS =>", req.remoteAddress, "LOCAL_ADDRESS =>", req.localAddress);
httpServer.emit('connection', req);
});

server.listen(PORT, () => {
   console.log(`СЕРВЕР СЛУШАЕТ НА ${PORT} ПОРТУ`);
});

process.on('uncaughtException', (err) => {
   console.log('ОШБИКА МАКРО ТАСКА:', err);
});

process.on('unhandledRejection', (err) => {
    console.log('ОШБИКА МИКРО ТАСКА:', err);
});