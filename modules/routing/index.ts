import {IncomingMessage, ServerResponse} from "http";
import {getNamesForReq} from "../../helpers/getNamesForReq";
import {AuthController} from "./auth/AuthController";
import {IClientDuplex} from "../../interfaces/IClientDuplex";
import {InvoiceController} from "./invoices/InvoiceController";

const dispatcherControllers = {
    'auth': AuthController.api.bind(AuthController),
    'invoices': InvoiceController.api.bind(InvoiceController),
}


export const routing = (req: IncomingMessage, res: ServerResponse) => {
    const fields = getNamesForReq(req);
    const clientDuplex: IClientDuplex = { request: req, response: res};
    console.log('fields =>', fields);
    try {
        //console.log('API =>', dispatcherControllers[fields.controller]);
        const currentControllerApi = dispatcherControllers[fields.controller];
        //console.log('currentControllerApi =>', currentControllerApi);
        currentControllerApi(clientDuplex, fields.method);
    } catch {
        res.statusCode = 404;
        res.end('API Controller Not Found');
    }
}