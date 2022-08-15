import {Collection, Db, MongoClient} from 'mongodb';

const HOST = 'localhost';
const PORT = '27017';

export class MongoConnectorBuilder  {
    static mongoClient: MongoClient = new MongoClient(`mongodb://${HOST}:${PORT}/`);

    static async connect() {
        try {
            this.mongoClient = await this.mongoClient.connect();
        } catch(err) {
            await this.mongoClient.close();
            throw err;
        }
    }

    static connectDatabase(nameDB: string) {
        return new MongoDB(this.mongoClient.db(nameDB));
    }
}

export class MongoDB {
  constructor(private db: Db) {
      this.db = db;
  }

  connectCollection(nameCol: string) {
     return this.db.collection(nameCol);
  }
}
