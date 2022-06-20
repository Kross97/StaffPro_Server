import {IncomingMessage, ServerResponse} from "http";

export interface IClientDuplex {
    request: IncomingMessage;
    response: ServerResponse;
}