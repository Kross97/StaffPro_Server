import {MongoConnectorBuilder, MongoDB} from "../MongoConnector";
import {Collection} from "mongodb";

type colNames = 'authorization';

const collectionsName: colNames[] = ['authorization'];

export class ConnectorMyDB {
   static _authDb: MongoDB | null  = null;
   static collections = new Map<string, Collection>();

   static initialize() {
      if(!this._authDb) {
         this._authDb = MongoConnectorBuilder.connectDatabase('myDb');
         collectionsName.forEach((col) => {
            this.collections.set(col, this._authDb.connectCollection(col));
         });
         console.log(`КОЛЛЕКЦИИ ${collectionsName.join('  # ')} ИНИЦИАЛИЗИРОВАНЫ`);
      }
   }

   static get authDatabase() {
      return this._authDb;
   }

   static getCollection(name: colNames) {
      return this.collections.get(name);
   }
}