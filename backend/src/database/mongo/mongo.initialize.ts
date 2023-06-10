import { MongoClient } from 'mongodb';
import { environment } from '../../../environments/environment';

const mongoClient = new MongoClient(environment.database.mongo_uri, {});

let _db;

const initMongoDatabase = () => {
  if (_db) {
    //connection already exists
    throw new Error('Database Connection Already Exists');
  }
  return mongoClient
    .connect()
    .then((client) => {
      _db = client.db(environment.database.name);
      return _db;
    })
    .catch((error) => {
      throw new Error(error);
    });
};

export { initMongoDatabase };
