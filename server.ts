import {routing} from "./modules/routing";
import {acceptCors} from "./helpers/acceptCors";

const http = require('http');
const net = require('net');


const PORT = 8010;

const httpServer = http.createServer((req, res) => {
    console.log('origin =>', req.headers['origin']);
    acceptCors(req, res);
    routing(req, res);
});

const server = net.createServer((req) => {
console.log('PROXY NET ADDRESS =>', req.address(), "REMOTE ADDRESS =>", req.remoteAddress);
httpServer.emit('connection', req);
});

server.listen(PORT, () => {
   console.log(`СЕРВЕР СЛУШАЕТ НА ${PORT} ПОРТУ`);
});

process.on('uncaughtException', (err) => {
   console.log('ОШБИКА:', err);
});