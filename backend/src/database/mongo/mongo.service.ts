import {Injectable, InternalServerErrorException, Logger, NotFoundException} from "@nestjs/common";
import {ObjectId} from "mongodb";
import {BaseCreationInterface, BaseInterface, GenericInterface} from "../../../../shared/interfaces";
import {DatabaseTables} from "../../../../shared/enums";

@Injectable()
export class MongoService {
    private _db: any;

    get database() {
        return this._db;
    }

    assignDatabase(database: Object) {
        if (!this._db && database) {
            this._db = database;
            Logger.log("Database successfully attached to service");
        } else {
            Logger.error("Cannot assign database as one is already in use.");
        }
    }

    bsonConvert(id: string): ObjectId {
        return new ObjectId(id);
    }

    stringConvert(id: ObjectId): string {
        return id.toString();
    }

    async getSingleItem(collection: DatabaseTables, _id: string): Promise<BaseInterface> {
        try {
            const result = await this._db.collection(collection).findOne({ _id: this.bsonConvert(_id) });
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

    async deleteSingleItem(collection: DatabaseTables, item_id: string): Promise<{ message: string }> {
        try {
            await this._db.collection(collection).deleteOne({ _id: this.bsonConvert(item_id) });
            return { message: "Delete Successful" };
        } catch (err) {
            Logger.error(`DB Service: Failed to delete item from collection: [${collection}] with id: [${item_id}]`);
            throw new InternalServerErrorException(`Unable to delete item`);
        }
    }

    async updateSingleItem(collection: DatabaseTables, id: string, item: GenericInterface | BaseInterface): Promise<BaseInterface> {
        try {
            const options = { upsert: false, returnDocument: "after" };
            const result = await this._db
                .collection(collection)
                .findOneAndUpdate({ _id: this.bsonConvert(id) }, { $set: item }, options);
            if (result.value._id) {
                return result.value;
            } else {
                new InternalServerErrorException(`Unable to update item. No result returned.`);
            }
        } catch (err) {
            Logger.error(`DB Service: Unable to update item of type:[${item.type}] with id: [${item._id}]`);
            throw new InternalServerErrorException(`Update of item was not successful`);
        }
    }

    async removeSingleDocumentKey(
        collection: DatabaseTables,
        id: string,
        item: GenericInterface | BaseInterface
    ): Promise<{ message: "success" }> {
        try {
            const options = { upsert: false, returnDocument: "after" };
            const result = await this._db
                .collection(collection)
                .findOneAndUpdate({ _id: this.bsonConvert(id) }, { $unset: item }, options);
            if (result.value._id) {
                return { message: "success" };
            } else {
                new InternalServerErrorException(`Unable to update item. No result returned.`);
            }
        } catch (err) {
            Logger.error(`DB Service: Unable to delete key from type:[${item.type}] with id: [${item._id}]`);
            throw new InternalServerErrorException(`Update of item was not successful`);
        }
    }
}
