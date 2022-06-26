import {IAddInvoice, IInvoice} from "../../../interfaces/invoices/IInvoices";
import path from "path";
import {dirExist} from "../filesHelpers/dirExist";
import {fileExist} from "../filesHelpers/fileExist";
import fs from "fs";
import {writeStreamCurrentFiles} from "../filesHelpers/writeStreamCurrentFiles";

const invoiceDir = '../../../filesDB/invoices';
const invoiceFile = '../../../filesDB/invoices/dataInvoices.json';


interface IDataAllInvoices {
    maxId: number;
    entities: IInvoice[];
}

interface IDataAllInvoicesWithCurrentInvoice {
    data: IDataAllInvoices;
    current: IInvoice;
}

const addInvoiceHandler = (body: IAddInvoice): Promise<IDataAllInvoicesWithCurrentInvoice> => {
  return new Promise((resolve, rejection) => {
      const dataFile = [];
      const streamFile = fs.createReadStream(InvoicesDatabasesFiles.invoicePathFile, 'utf-8');
      streamFile.on('data', (chunk) => {
         dataFile.push(chunk.toString());
      });

      streamFile.on('end', () => {
         console.log('ALL_DATA_FILE', dataFile);
         const allInvoice: IDataAllInvoices = JSON.parse(dataFile[0]);
         console.log('ALL_INVOICE', allInvoice);
         const maxId = ++allInvoice.maxId;
         const currentInvoice = { id: maxId, ...body };
         allInvoice.entities.push(currentInvoice);
         console.log('STRUCT_ALL_INVOICES', allInvoice);
         resolve({ data: allInvoice, current: currentInvoice});
      });

      streamFile.on('error', (err) => {
          rejection(err);
      });
  });
};

const getInvoices = () => {
    return new Promise((resolve, rejection) => {
       const dataFile = [];
       const streamRead = fs.createReadStream(InvoicesDatabasesFiles.invoicePathFile);

       streamRead.on('data', (chunk) => {
          dataFile.push(chunk.toString());
       });

       streamRead.on('end', () => {
          const allDataInvoices: IDataAllInvoices = JSON.parse(dataFile[0]);
          resolve(allDataInvoices.entities);
       });

       streamRead.on('error', (err) => {
          rejection(err);
       });
    });
};

export class InvoicesDatabasesFiles {
    static invoicePathFile = path.resolve(__dirname, invoiceFile);
    static invoicePathDir = path.resolve(__dirname, invoiceDir);
    static initialDataFile: IDataAllInvoices = { maxId: 0, entities: []};

    static async addInvoice(body: IAddInvoice) {
       await dirExist(InvoicesDatabasesFiles.invoicePathDir);
       await fileExist(InvoicesDatabasesFiles.invoicePathFile, InvoicesDatabasesFiles.initialDataFile);
       try {
           const invoice = await addInvoiceHandler(body);
           console.log('INVOICE_DATA', invoice);
           await writeStreamCurrentFiles(InvoicesDatabasesFiles.invoicePathFile, invoice.data);
           return invoice.current;
       } catch (err) {
           throw err;
       }
    }

    static async getInvoices() {
        await dirExist(InvoicesDatabasesFiles.invoicePathDir);
        await fileExist(InvoicesDatabasesFiles.invoicePathFile);
        try {
            const invoices = await getInvoices();
            return invoices;
        } catch (err) {
            throw err;
        }
    }
}