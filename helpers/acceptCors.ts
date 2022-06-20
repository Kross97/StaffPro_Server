import {IncomingMessage, ServerResponse} from "http";

const corsSuccess = (response, origin) => {
    response.setHeader('Access-Control-Allow-Origin', origin);
    response.setHeader('Access-Control-Allow-Methods', '*');
    response.setHeader('Access-Control-Allow-Headers', '*');
    response.setHeader('Access-Control-Max-Age', 2592000);
}
const allowCors = ['http://localhost:3000'];

export const acceptCors = (req: IncomingMessage, res: ServerResponse) => {
    if(allowCors.includes(req.headers['origin'])) {
        corsSuccess(res, req.headers['origin']);
    }
};