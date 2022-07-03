import {IClientDuplex} from "../../../interfaces/IClientDuplex";
import formidable from 'formidable';
import fs from 'fs';
import {dirExist} from "../../databases/filesHelpers/dirExist";
import * as path from "path";

type TMethodsName = Exclude<keyof typeof FileController, 'prototype' | 'api' >;

const dispatcherFilesApi: Array<{ match: RegExp, method: TMethodsName}> = [
    { match: /^postAddFile$/i, method: 'addFile'},
    { match: /^getFile\/(?<file>[\w_-]+\.[\w\d]+)$/i, method: 'getFile'}
];

const form = new formidable.IncomingForm();

export class FileController {
    static dirStaticFile = path.resolve(__dirname, '../../../allStaticFiles');

    static getFile(client: IClientDuplex, params: Record<'file', string>) {
         const readStream = fs.createReadStream(`${FileController.dirStaticFile}/${params.file}`);
         const dataFile = [];

         readStream.on('data', (chunk: Buffer) => {
            dataFile.push(chunk.toJSON().data);
         });

         readStream.on('end', () => {
             console.log('ALL_DATA_FILE', dataFile);
             const allDataFiles = dataFile.reduce((acc, item) => [...acc, ...item], []);
             console.log('ARR DATA', Buffer.from(allDataFiles));
             client.response.write(Buffer.from(allDataFiles));
             client.response.end();
         });

         // аналог readStream.pipe(client.response);
    }

    static async addFile(client: IClientDuplex) {
        await dirExist(FileController.dirStaticFile);

        form.parse(client.request, (err) => {
           //console.log('ERRR =>', err);
        });
        form.on('field', (name, value) => {
           //console.log("NAME", name, 'VALUE', value);
        });
        form.on('file', (formname, file) => {
            //console.log('FILE_PATH =>', file.filepath, 'NAME =>', file.originalFilename);
            const readStream = fs.createReadStream(file.filepath);
            const writableStream = fs.createWriteStream(`${FileController.dirStaticFile}/${file.originalFilename}`);
            readStream.pipe(writableStream);
            client.response.end(`api/files/file/${file.originalFilename}`);
        });
    }
    static async api(client: IClientDuplex, methodName:string) {
        const nameMethod = `${client.request.method}${methodName}`.toLowerCase();
        let methodMatch: any = null;
        for (let pathData of dispatcherFilesApi) {
            if(pathData.match.test(nameMethod)) {
                methodMatch = { method: pathData.method, matches: nameMethod.match(pathData.match)}
                break;
            }
        };
        console.log('METHOD_MATCH', methodMatch);
        const currentMethod = this[methodMatch.method];
        if(currentMethod) {
            currentMethod(client, methodMatch.matches.groups);
        } else {
            client.response.statusCode = 404;
            client.response.end('Method Not Allowed');
        }
    }
}