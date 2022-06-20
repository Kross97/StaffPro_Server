import {IClientDuplex} from "../interfaces/IClientDuplex";

export const postMethodBodyHandler = async (client: IClientDuplex): Promise<Record<string, any> | undefined> => {
  let body = '';
  try {
    return await new Promise((resolve, reject) => {
          /*client.request.on('readable', () => {
              console.log("POST_REQUEST EVENT: READABLE");
          });*/

          client.request.on('data', (chunk) => {
              console.log('DATA CHUNK:', chunk);
              body += chunk.toString();
          });

          client.request.on('end', () => {
              console.log('POST_REQUEST_BODY END:', body, );
              try {
                  const data = JSON.parse(body);
                  resolve(data);
              } catch {
                  reject({ message: 'Error JSON parse body' });
              }
          });

          client.request.on('error', (err) => {
              reject({ error: err, message: 'Error read body'});
          });
      });
  } catch (err) {
      client.response.statusCode = 400;
      client.response.end(JSON.stringify(err));
  }
};