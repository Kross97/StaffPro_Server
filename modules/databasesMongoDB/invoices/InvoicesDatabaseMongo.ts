import {IAddInvoice, IInvoice} from "../../../interfaces/invoices/IInvoices";
import {ConnectorMyDB} from "../connectorsDB/mongoDBConector/connectors/ConnectorMyDB";
import {ObjectId} from 'mongodb';

export class InvoicesDatabaseMongo {
    static async addInvoice(body: IAddInvoice): Promise<IInvoice> {
        try {
           const operationsData = await ConnectorMyDB.getCollection('invoices').insertOne(body);
           return await ConnectorMyDB.getCollection('invoices').findOne({ _id: operationsData.insertedId }) as any;
        } catch (err) {
            throw err;
        }
    }

    static async deleteInvoice(id: string): Promise<IInvoice> {
        try {
           const data = await ConnectorMyDB.getCollection('invoices').findOneAndDelete({ _id: new ObjectId(id) }) as any;
           if(data.value) {
               return data;
           } else {
               throw { status: 404, message: 'Invoice not exist'};
           }
        } catch (err) {
            throw err;
        }
    }

    static async getInvoices(): Promise<IInvoice[]> {
        try {
            return await ConnectorMyDB.getCollection('invoices').find({}).toArray() as any;
        } catch (err) {
            throw err;
        }
    }
}
