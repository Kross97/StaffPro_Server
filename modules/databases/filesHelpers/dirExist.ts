import * as fs from "fs/promises";

export const dirExist = async (currentPath: string) => {
    //console.log('__dirName', __dirname);
    //console.log('CURRENT_PATH', currentPath);
    try {
        const existDir = await fs.stat(currentPath);
        //console.log('EXIST_DIR ', existDir);
    } catch {
            await fs.mkdir(currentPath);
    }
};