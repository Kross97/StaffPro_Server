import {IClientDuplex} from "../../../interfaces/IClientDuplex";
import {postMethodBodyHandler} from "../../../helpers/postMethodBodyHandler";
import {IAddInvoice} from "../../../interfaces/invoices/IInvoices";
import {errorHandler} from "../../../helpers/responseHelpers/errorHandler";
import {InvoiceService} from "../../services/invoices/InvoiceService";
import {jsonSuccess} from "../../../helpers/responseHelpers/jsonSuccess";

type TMethodsName = Exclude<keyof typeof InvoiceController, 'prototype' | 'api' >;

const dispatcherInvoicehApi: Array<{ match: RegExp, method: TMethodsName}> = [
    { match: /^postAddInvoice$/i, method: 'addInvoice'},
    { match: /^getInvoices$/i, method: 'getInvoices'},
    { match: /^deleteDelete\/(?<id>[\d]+)$/i, method: 'deleteInvoice'}
    ];

export class InvoiceController {
    static async addInvoice(client: IClientDuplex) {
        const body = await postMethodBodyHandler<IAddInvoice>(client);
        try {
             const response = await InvoiceService.addInvoice(body);
             jsonSuccess(client, response);
        } catch (err) {
            console.log('ADD_INVOICE_ERROR', err);
            errorHandler(client, err);
        }
    };

    static async getInvoices(client: IClientDuplex) {
     try {
         const response = await InvoiceService.getInvoices();
         jsonSuccess(client, response);
     }  catch (err) {
         console.log('GET_INVOICE_ERR', err);
         errorHandler(client, err);
     }
    }

    static async deleteInvoice(client: IClientDuplex, pathParams: Record<'id', string>) {
        try {
           const response = await InvoiceService.deleteInvoice(pathParams.id);
           jsonSuccess(client, response);
        } catch (err) {
          errorHandler(client, err);
        }
    }

    static api(client: IClientDuplex, methodName: string) {
        const nameMethod = `${client.request.method}${methodName}`.toLowerCase();
        let methodMatch: any = null;
        for (let pathData of dispatcherInvoicehApi) {
             if(pathData.match.test(nameMethod)) {
                 methodMatch = { method: pathData.method, matches: nameMethod.match(pathData.match)}
                 break;
             }
        };
        console.log('METHOD_MATCH', methodMatch);
        const currentMethod = this[methodMatch.method];
        if(currentMethod) {
            currentMethod(client, methodMatch.matches.groups);
        } else {
            client.response.statusCode = 404;
            client.response.end('Method Not Allowed');
        }
    }
}