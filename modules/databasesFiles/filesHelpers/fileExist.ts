import * as fs from "fs/promises";

export const fileExist = async (path: string, initialStruct?: object) => {
    try {
        const existFile = await fs.stat(path);
        //console.log("EXIST_FILE", existFile);
    } catch {
            await fs.writeFile(path, JSON.stringify(initialStruct ?? []), 'utf8');
    }
};