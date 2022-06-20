import {dirExist} from "../filesHelpers/dirExist";
import {fileExist} from "../filesHelpers/fileExist";
import {writeCurrentFile} from "../filesHelpers/writeCurrentFile";
import * as path from "path";
import {ISignInRequest, IUserDto, IUserResponse} from "../../../interfaces/auth/IAuths";
const fsSync = require('fs');

const usersDir = '../../../filesDB/users';
const usersFile = '../../../filesDB/users/dataUsers.json';

const checkUserNotExist = async (data: IUserDto): Promise<IUserDto[]> => {
    const dataFile = [];
    return new Promise((resolve, reject) => {
        const stream = fsSync.createReadStream(path.resolve(__dirname, usersFile));
        stream.on('data', (chunk) => {
            dataFile.push(chunk.toJSON().data);
        })

        stream.on('end', () => {
            const allDataFile = dataFile.reduce((acc, item) => [...acc, ...item] , []);
            const allDataUsers: IUserDto[] = JSON.parse(Buffer.from(allDataFile).toString('utf-8'));
            if (allDataUsers.some((user) => user.email === data.email)) {
                reject({ message: 'User exist', status: 409});
            } else {
                allDataUsers.push(data);
                resolve(allDataUsers);
            }
        });
    });
};


const checkUserExist = async (data: ISignInRequest): Promise<IUserDto> => {
 const dataFile = [];
 return new Promise((resolve, reject) => {
     const stream = fsSync.createReadStream(path.resolve(__dirname, usersFile));
     stream.on('data', (chunk) => {
         dataFile.push(chunk.toString('utf-8'));
     })

     stream.on('end', () => {
         console.log('DATA_FILE', dataFile);

         let user;
         const allDataUsers: IUserDto[] = JSON.parse(dataFile[0]);
         console.log('allDataUsers =>', allDataUsers);
         if (user = allDataUsers.find((user) => user.email === data.email && user.password === data.password)) {
             console.log('USER =>', user);
             resolve(user);
         } else {
             reject({ message: 'User or password failed', status: 404});
         }
     });
 });
};

export class AuthDatabasesFiles {
    static  dirPath: string = path.resolve(__dirname, usersDir);
    static usersFile: string = path.resolve(__dirname, usersFile);

    static async signUp(data: IUserDto): Promise<IUserResponse> {
        await dirExist(AuthDatabasesFiles.dirPath);
        await fileExist(AuthDatabasesFiles.usersFile);
        try {
            const dataChecked = await checkUserNotExist(data);
            await writeCurrentFile(AuthDatabasesFiles.usersFile, dataChecked);
            const {remember, password, ...rest} = data;
            return rest;
        }
         catch (err) {
            throw err;
        }
    }

    static async signIn(data: ISignInRequest): Promise<IUserResponse> {
     await dirExist(AuthDatabasesFiles.dirPath);
     await fileExist(AuthDatabasesFiles.usersFile);
        try {
            const dataChecked = await checkUserExist(data);
            const {remember, password, ...rest} = dataChecked;
            return rest;
        }
        catch (err) {
            throw err;
        }
    }
}