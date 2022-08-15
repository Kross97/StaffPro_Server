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
         const allInvoice: IDataAllInvoices = JSON.parse(dataFile.join(''));
         const maxId = ++allInvoice.maxId;
         const currentInvoice = { id: maxId, ...body };
         allInvoice.entities.push(currentInvoice);
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
          const allDataInvoices: IDataAllInvoices = JSON.parse(dataFile.join(''));
          resolve(allDataInvoices.entities);
       });

       streamRead.on('error', (err) => {
          rejection(err);
       });
    });
};

interface IDeleteInvoice {
    deleted: IInvoice;
    invoicesData: IDataAllInvoices;
}

const deleteInvoice = (id: string): Promise<IDeleteInvoice> => {
  return new Promise((resolve, reject) => {
     const dataFile = [];
     // Для тестирования , внутренний буфер потока ограничен 2 байтами
     const readStream = fs.createReadStream(InvoicesDatabasesFiles.invoicePathFile, { encoding: 'utf8', highWaterMark: 2});

     readStream.on('data', (chunk) => {
        console.log("CHUNK", chunk.toString());
        dataFile.push(chunk.toString());
     });

     readStream.on('end', () => {
         const allInvoices: IDataAllInvoices = JSON.parse(dataFile.join(''));
         let deletedInvoice = null;
         const clearedInvoiced = allInvoices.entities.filter((invoice) => {
             if(invoice.id !== +id) {
                 return true;
             } else {
                 deletedInvoice = invoice;
                 return false;
             }
         });
         if(deletedInvoice) {
             resolve({ deleted: deletedInvoice, invoicesData: {...allInvoices, entities: clearedInvoiced} });
         } else {
             console.log('NOT INVOICE REMOVED');
             reject({ status: 404, message: 'Invoice for removed, not exist'});
         }
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
           await writeStreamCurrentFiles(InvoicesDatabasesFiles.invoicePathFile, invoice.data);
           return invoice.current;
       } catch (err) {
           throw err;
       }
    }

    static async deleteInvoice(id: string) {
        await dirExist(InvoicesDatabasesFiles.invoicePathDir);
        await fileExist(InvoicesDatabasesFiles.invoicePathFile);
        try {
          const deletedDataInvoice = await deleteInvoice(id);
          await writeStreamCurrentFiles(InvoicesDatabasesFiles.invoicePathFile, deletedDataInvoice.invoicesData);
          return deletedDataInvoice.deleted;
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