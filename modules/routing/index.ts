import {IncomingMessage, ServerResponse} from "http";
import {getNamesForReq} from "../../helpers/getNamesForReq";
import {AuthController} from "./auth/AuthController";
import {IClientDuplex} from "../../interfaces/IClientDuplex";

const dispatcherControllers = {
    'auth': AuthController.api.bind(AuthController),
}


export const routing = (req: IncomingMessage, res: ServerResponse) => {
    const fields = getNamesForReq(req);
    const clientDuplex: IClientDuplex = { request: req, response: res};
    try {
        const currentControllerApi = dispatcherControllers[fields.controller];
        console.log('currentControllerApi =>', currentControllerApi);
        currentControllerApi(clientDuplex, fields.method);
    } catch {
        res.statusCode = 404;
        res.end('Not Found');
    }
}