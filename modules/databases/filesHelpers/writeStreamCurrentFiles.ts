import fs, { WriteStream } from 'fs';
import stream from 'stream';

const chunkWriter = (writeStream: WriteStream, chunk: Buffer) => {
    return writeStream.write(chunk, (err) => {
        if(err) {
            writeStream.close(() => {
                console.log('WRITABLE_STREAM_CLOSED');
            })
        }
    });
};

export const writeStreamCurrentFiles = async (path: string, data: Record<string, any>) => {
 return new Promise((resolve) => {
     const writeStream = fs.createWriteStream(path, 'utf-8');
     const bufferData = Buffer.from(JSON.stringify(data));
     //console.log('BUFFER_DATA_WRITABLE =>', bufferData);
     const readableStream = stream.Readable.from(bufferData);
      //console.log('readableStream =>', readableStream);

     readableStream.on('data', (chunk) => {
         //console.log("WRITABLE_READABLE_CHUNK =>", chunk);
         const res = chunkWriter(writeStream, chunk);
         if(!res) {
             writeStream.on('drain', () => {
                 chunkWriter(writeStream, chunk);
             })
         }
     });

     readableStream.on('end', () => {
        //console.log('READEBLE_STREAM_END');
        resolve('READABLE_STREAM_FINISH');
     });

     writeStream.on('ready', () => {
         //console.log("WRETABLE_STREAM_READY");
     });

     writeStream.on('finish', () => {
         //console.log('WRITABLE_STREAM_FINISH');
         //resolve('FINISH');
     });
 });
};