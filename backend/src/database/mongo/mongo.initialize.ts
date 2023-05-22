import { MongoClient } from 'mongodb';
import { environment } from '../../../environments/environment';

const mongoClient = new MongoClient(environment.database.mongo_uri, {});

let _db;

const initMongoDatabase = (callback) => {
  if (_db) {
    console.log('Connection already exists');
    return callback(null, _db);
  }
  mongoClient
    .connect()
    .then((client) => {
      _db = client.db(environment.database.name);
      callback(null, _db);
    })
    .catch((error) => {
      callback(error);
    });
};

export { initMongoDatabase };
