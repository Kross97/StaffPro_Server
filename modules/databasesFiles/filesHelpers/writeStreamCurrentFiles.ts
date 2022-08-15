import fs, { WriteStream } from 'fs';
import stream, {Readable} from 'stream';

const chunkWriter = (writeStream: WriteStream, readable: Readable) => function NFE(chunk: Buffer) {
        console.log("WRITABLE_READABLE_CHUNK =>", chunk);
        const res = writeStream.write(chunk);
        if(!res) {
            readable.pause();
            writeStream.on('drain', () => {
               console.log('ON_DRAINED!!!!');
                readable.resume();
               NFE(chunk);
            })
        }
};

export const writeStreamCurrentFiles = async (path: string, data: Record<string, any>) => {
 return new Promise((resolve) => {
     const writeStream = fs.createWriteStream(path, 'utf-8');
     const bufferData = Buffer.from(JSON.stringify(data));
     console.log('BUFFER_DATA_WRITABLE =>', bufferData);
     const readableStream = stream.Readable.from(bufferData);
      //console.log('readableStream =>', readableStream);

     readableStream.on('data', chunkWriter(writeStream, readableStream));

     readableStream.on('pause', () => {
        console.log('READABLE_STREAM_INVOICES_PAUSED');
     });

     readableStream.on('resume', () => {
        console.log('READABLE_STREAM_INVOICES_RESUMED');
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