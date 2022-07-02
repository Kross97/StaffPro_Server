import {IncomingMessage, ServerResponse} from "http";

const allowHeaders = (response, origin) => {
    response.setHeader('Access-Control-Allow-Origin', origin);
    response.setHeader('Access-Control-Allow-Methods', '*');
    response.setHeader('Access-Control-Max-Age', 2592000);
};

export const acceptOptions = (req: IncomingMessage, res: ServerResponse) => {
           allowHeaders(res, req.headers.origin);
           res.end();
};