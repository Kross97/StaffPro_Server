import {IncomingMessage, ServerResponse} from "http";

const corsSuccess = (response, origin) => {
    // заголовки для отключение CORS
    response.setHeader('Access-Control-Allow-Origin', origin);
    response.setHeader('Access-Control-Allow-Methods', '*');
    response.setHeader('Access-Control-Allow-Headers', '*');
    response.setHeader('Access-Control-Max-Age', 2592000);
    // заголовки для разрешения передачи кук
    response.setHeader('Access-Control-Allow-Credentials', 'true');
    response.setHeader('Set-Cookie', 'myCookie=ddddddsadasd; SameSite=None; Secure')
}
const allowCors = ['http://localhost:3000'];

export const acceptCors = (req: IncomingMessage, res: ServerResponse) => {
    if(allowCors.includes(req.headers['origin'])) {
        corsSuccess(res, req.headers['origin']);
    }
};