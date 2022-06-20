import {IClientDuplex} from "../../interfaces/IClientDuplex";

export interface IErrorOperation {
    status: number;
    message: string;
    error: Error;
}

export const errorHandler = (client: IClientDuplex, err: Error | IErrorOperation) => {
    client.response.statusCode = 'status' in err ? err.status : 400;
    client.response.end(JSON.stringify(err));
};