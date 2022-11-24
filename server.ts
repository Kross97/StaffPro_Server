import {routing} from "./modules/routing";
import {acceptCors} from "./helpers/acceptCors";
import {acceptOptions} from "./helpers/acceptOptions";
import {MongoConnectorBuilder} from "./modules/databasesMongoDB/connectorsDB/mongoDBConector/MongoConnector";
import {ConnectorMyDB} from "./modules/databasesMongoDB/connectorsDB/mongoDBConector/connectors/ConnectorMyDB";
import { Workbook } from 'exceljs';

const http = require('http');
const net = require('net');


const PORT = 8001;

const httpServer = http.createServer((req, res) => {
    if(req.method === 'OPTIONS') {
        acceptOptions(req, res);
    } else {
        acceptCors(req, res);
        if(req.url.includes('/file')) {
            const buffer = [];
            req.on('data', (chunk) => {
               buffer.push(chunk);
            });
            req.on('end', () => {
                const workbook = new Workbook();
                const items = [];
                const titles = {};
                workbook.xlsx.load(Buffer.from(buffer[0])).then((resWorkBook) => {
                    const sheet = resWorkBook.getWorksheet(1);
                    // sheet.columns.forEach((column, index) => {
                    //    console.log('HEADER:', column.header, 'VALUES:', column.values, 'WIDTH:', column.width);
                    // });
                    sheet.eachRow({ includeEmpty: false }, (row, rowNumber) => {
                       console.log('ROW:', rowNumber, row.values);
                    });
                });
                res.end();
            });
        }
    }
});

const server = net.createServer((req) => {
//console.log('PROXY NET ADDRESS =>', req.address(), "REMOTE ADDRESS =>", req.remoteAddress, "LOCAL_ADDRESS =>", req.localAddress);
httpServer.emit('connection', req);
});

server.listen(PORT, () => {
   console.log(`СЕРВЕР СЛУШАЕТ НА ${PORT} ПОРТУ`);
    // MongoConnectorBuilder.connect().then(() => {
    //     console.log('БАЗА MONGODB ПОДКЛЮЧЕНА');
    //     ConnectorMyDB.initialize();
    // }).catch(() => {
    //     server.emit('close');
    // })
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