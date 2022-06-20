import * as fs from "fs/promises";

export const writeCurrentFile = async (path: string, data: Record<string, any>) => {
    try {
        const readlink = await fs.readlink(path);
        //console.log('readlink =>', readlink);
        const realpath = await fs.realpath(path);
       // console.log('realpath =>', realpath);
    } catch {

    }
    await fs.writeFile(path, JSON.stringify(data));
};