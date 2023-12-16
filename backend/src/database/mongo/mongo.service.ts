import { InternalServerErrorException, Logger, NotFoundException } from '@nestjs/common';
import { ObjectId } from 'mongodb';
import {
  BaseCreationInterface,
  BaseInterface,
  GenericInterface,
  SuccessMessageInterface,
} from '../../../../shared/interfaces';
import { DatabaseTables } from '../../../../shared/enums';

/**
 * Please do not import this service directly as it could make switching to another provider difficult!
 * Use the `DatabaseService` from the `DatabaseModule` instead.
 */
export class MongoService {
  private _db: any;

  get database() {
    return this._db;
  }

  assignDatabase(database: object) {
    if (!this._db && database) {
      this._db = database;
      Logger.log('Database successfully attached to MongoService');
    } else if (this._db) {
      Logger.error('Cannot assign database as one is already in use.');
    } else if (!database) {
      Logger.error('Did not receive a database to assign');
    } else {
      Logger.error('Something went wrong assigning the database');
    }
  }

  idConvert(id: string | ObjectId): ObjectId {
    if (typeof id === 'string') {
      return new ObjectId(id);
    }
    return id;
  }

  stringConvert(id: ObjectId): string {
    return id.toString();
  }

  async getSingleItem(collection: DatabaseTables, _id: string): Promise<BaseInterface> {
    try {
      const result = await this._db.collection(collection).findOne({ _id: this.idConvert(_id) });
      if (result) {
        return result;
      } else {
        new NotFoundException();
      }
    } catch (err) {
      Logger.error(`DB Service: Failed to find single item from [${collection}] with id: [${_id}]`);
      throw new NotFoundException();
    }
  }

  async getAllOrgItems(collection: DatabaseTables, idOrganization: string): Promise<BaseInterface[]> {
    try {
      const result = await this._db
        .collection(collection)
        .find({ id_organization: this.idConvert(idOrganization) })
        .toArray();
      if (result) {
        return result;
      } else {
        new NotFoundException();
      }
    } catch (err) {
      Logger.error(`DB Service: Failed to find items from [${collection}] with org id: [${idOrganization}]`);
      throw new NotFoundException();
    }
  }

  async getAllUserItems(collection: DatabaseTables, idUser: string | ObjectId): Promise<BaseInterface[]> {
    try {
      const result = await this._db
        .collection(collection)
        .find({ id_user: this.idConvert(idUser) })
        .toArray();
      if (result) {
        return result;
      } else {
        new NotFoundException();
      }
    } catch (err) {
      Logger.error(`DB Service: Failed to find items from [${collection}] with user id: [${idUser}]`);
      throw new NotFoundException();
    }
  }

  async insertSingleItem(collection: DatabaseTables, item: BaseCreationInterface): Promise<BaseInterface> {
    try {
      const result = await this._db.collection(collection).insertOne(item);
      if (result) {
        return { _id: result.insertedId, ...item };
      }
    } catch (err) {
      Logger.error(`DB Service: Failed to insert type: [${item.type}]`);
      throw new InternalServerErrorException(`Unable to create item`);
    }
  }

  async deleteSingleItem(collection: DatabaseTables, _id: string): Promise<SuccessMessageInterface> {
    try {
      await this._db.collection(collection).deleteOne({ _id: this.idConvert(_id) });
      return { message: 'success' };
    } catch (err) {
      Logger.error(`DB Service: Failed to delete item from collection: [${collection}] with id: [${_id}]`);
      throw new InternalServerErrorException(`Unable to delete item`);
    }
  }

  async updateSingleItem(
    collection: DatabaseTables,
    id: string,
    item: GenericInterface | BaseInterface,
  ): Promise<BaseInterface> {
    try {
      const options = { upsert: false, returnDocument: 'after' };
      const result = await this._db
        .collection(collection)
        .findOneAndUpdate({ _id: item._id }, { $set: item }, options);
      if (result._id) {
        return result;
      } else {
        new InternalServerErrorException(`Unable to update item. No result returned.`);
      }
    } catch (err) {
      Logger.error(err);
      throw new InternalServerErrorException(`Update of item was not successful`);
    }
  }

  async updateImagesArray(collection: DatabaseTables, id: string, newItems: string[]): Promise<BaseInterface> {
    try {
      const options = { upsert: false, returnDocument: 'after' };
      const result = await this._db
        .collection(collection)
        .findOneAndUpdate({ _id: this.idConvert(id) }, { $push: { images: { $each: newItems } } }, options);
      if (result._id) {
        return result;
      } else {
        new InternalServerErrorException(`Unable to update item. No result returned.`);
      }
    } catch (err) {
      Logger.error(`DB Service: Unable to update array on item with id: [${id}]`);
      throw new InternalServerErrorException(`Update of item was not successful`);
    }
  }
}
