import * as fs from "fs/promises";

export const fileExist = async (path: string) => {
    try {
        const existFile = await fs.stat(path);
        //console.log("EXIST_FILE", existFile);
    } catch {
            await fs.appendFile(path, JSON.stringify([]), 'utf8');
    }
};