import {IAddInvoice, IInvoice} from "../../../interfaces/invoices/IInvoices";
import {InvoicesDatabasesFiles} from "../../databasesFiles/invoices/InvoicesDatabasesFiles";
import {InvoicesDatabaseMongo} from "../../databasesMongoDB/invoices/InvoicesDatabaseMongo";

export class InvoiceService {
  static async addInvoice(body: IAddInvoice) {
      return InvoicesDatabaseMongo.addInvoice(body);
  }

  static async deleteInvoice(id: string): Promise<IInvoice> {
      return InvoicesDatabaseMongo.deleteInvoice(id);
  }

  static async getInvoices() {
      return InvoicesDatabaseMongo.getInvoices();
  }
};