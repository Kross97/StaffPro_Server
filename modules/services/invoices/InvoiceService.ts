import {IAddInvoice} from "../../../interfaces/invoices/IInvoices";
import {InvoicesDatabasesFiles} from "../../databases/invoices/InvoicesDatabasesFiles";

export class InvoiceService {
  static async addInvoice(body: IAddInvoice) {
      return InvoicesDatabasesFiles.addInvoice(body);
  }

  static async getInvoices() {
      return InvoicesDatabasesFiles.getInvoices();
  }
};