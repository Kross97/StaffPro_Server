import {routing} from "./modules/routing";
import {acceptCors} from "./helpers/acceptCors";
import {acceptOptions} from "./helpers/acceptOptions";
import {MongoConnectorBuilder} from "./modules/databasesMongoDB/connectorsDB/mongoDBConector/MongoConnector";
import {ConnectorMyDB} from "./modules/databasesMongoDB/connectorsDB/mongoDBConector/connectors/ConnectorMyDB";

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
    MongoConnectorBuilder.connect().then(() => {
        console.log('БАЗА MONGODB ПОДКЛЮЧЕНА');
        ConnectorMyDB.initialize();
    }).catch(() => {
        server.emit('close');
    })
});

server.on('close', () => {
   console.log('СЕРВЕР ОТКЛЮЧЕН');
});

process.on('uncaughtException', (err) => {
   console.log('ОШБИКА МАКРО ТАСКА:', err);
});

process.on('unhandledRejection', (err) => {
    console.log('ОШБИКА МИКРО ТАСКА:', err);
});