import {IClientDuplex} from "../../interfaces/IClientDuplex";

export const jsonSuccess = (client: IClientDuplex, data: Record<string, any>) => {
    client.response.statusCode = 200;
    client.response.setHeader('Content-type', 'application/json');
    //console.log("JSON_SUCCESS => ", data);
    client.response.end(JSON.stringify(data));
};