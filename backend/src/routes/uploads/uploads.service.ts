import {
  ForbiddenException,
  Injectable,
  InternalServerErrorException,
  Logger,
  UnprocessableEntityException,
} from '@nestjs/common';
import { Storage, GetSignedUrlConfig } from '@google-cloud/storage';
import { environment } from '../../../environments/environment';
import { DatabaseTables, TypesEnum } from '../../../../shared/enums';
import { DatabaseService } from '../../database';
import {
  BaseInterface,
  DocumentInterface,
  SuccessMessageInterface,
  TokenInterface,
} from '../../../../shared/interfaces';
import { ObjectId } from 'mongodb';

@Injectable()
export class UploadsService {
  storage: Storage;

  constructor(private databaseService: DatabaseService) {
    //https://developers.google.com/workspace/guides/create-credentials
    this.storage = new Storage({
      keyFilename: './src/routes/uploads/google.config.json',
      projectId: environment.google.project_id,
    });
  }

  private readonly logger = new Logger(UploadsService.name);

  private async assignImagesToEntity(attachTo: BaseInterface, imageUrls: string[]) {
    const collectionString: DatabaseTables = this.returnValidTableString(attachTo.type);
    if (collectionString) {
      this.databaseService.updateImagesArray(collectionString, attachTo._id, imageUrls);
    } else {
      throw new ForbiddenException('You may not upload those images here.');
    }
  }

  async uploadImages(
    token: TokenInterface,
    attachTo: BaseInterface,
    images: Array<Express.Multer.File>,
  ): Promise<string[]> {
    const promises: Promise<string>[] = [];
    const result: string[] = [];

    for (let i = 0; i < images.length; i++) {
      const fileName = `${token.oid}/${this.generateRandomFilename(images[i].mimetype, attachTo.type)}`;
      promises.push(this.uploadSingleImage(fileName, images[i].buffer));
    }

    const settled = await Promise.allSettled(promises);
    settled.forEach((promise) => {
      promise.status == 'fulfilled' ? result.push(promise.value) : '';
    });

    this.assignImagesToEntity(attachTo, result);
    return result;
  }

  async uploadPdfDocument(
    token: TokenInterface,
    file: Express.Multer.File,
    displayName: string,
    attachTo: BaseInterface,
  ): Promise<DocumentInterface> {
    try {
      const databaseTable = this.returnValidTableString(attachTo.type);
      const generatedFilename = displayName.replace(/[/\\?%*:|"<> ]/g, '-').toLowerCase() + '.pdf';
      const filename = `${token.oid}/${generatedFilename}`;
      const result = await this.uploadSingleDocument(filename, file.buffer);
      if (result) {
        const update = {};
        update[`documents.${displayName}`] = { url: generatedFilename, date_uploaded: new Date() };
        //associate PDF url with the entity it should be attached to, document for that item will then have filenames stored on it
        await this.databaseService.updateSingleItem(databaseTable, attachTo._id, update);
        return update[`documents.${displayName}`];
      }
    } catch (e) {
      throw new UnprocessableEntityException();
    }
  }

  async getAuthedPdfUrl(token: TokenInterface, fileName: string): Promise<{ url: string }> {
    // These options will allow temporary read access to the file
    const options: GetSignedUrlConfig = {
      version: 'v4',
      action: 'read',
      expires: Date.now() + 15 * 60 * 1000, // 15 minutes
    };

    // Get a v4 signed URL for reading the file
    const fullFileName = `${token.oid}/${fileName}`;
    const [result] = await this.storage
      .bucket(environment.google.doc_bucket_id)
      .file(fullFileName)
      .getSignedUrl(options);

    if (result) {
      return { url: result };
    } else {
      throw new InternalServerErrorException('Failed to generate signed url');
    }
  }

  private async uploadSingleImage(fileName: string, image: Buffer): Promise<string> {
    try {
      await this.storage.bucket(environment.google.image_bucket_id).file(fileName).save(image);
      return fileName;
    } catch (e) {
      this.logger.error(e);
      throw new UnprocessableEntityException();
    }
  }

  private async uploadSingleDocument(fileName: string, file: Buffer): Promise<string> {
    try {
      await this.storage.bucket(environment.google.doc_bucket_id).file(fileName).save(file);
      return fileName;
    } catch (e) {
      this.logger.error(e);
      throw new UnprocessableEntityException();
    }
  }

  async attemptDocumentDelete(token: TokenInterface, fileName: string): Promise<SuccessMessageInterface> {
    try {
      await this.storage.bucket(environment.google.doc_bucket_id).file(`${token.oid}/${fileName}`).delete();
      return { message: 'success' };
    } catch (e) {
      this.logger.error(e);
    }
  }

  async attemptImageDelete(token: TokenInterface, fileName: string): Promise<SuccessMessageInterface> {
    const orgId: string = fileName.split('/')[0];
    if (orgId == token.oid) {
      try {
        await this.storage.bucket(environment.google.image_bucket_id).file(`${fileName}`).delete();
        return { message: 'success' };
      } catch (e) {
        this.logger.error(e);
      }
    }
    throw new ForbiddenException('You cannot delete that image');
  }

  private generateRandomFilename(fileType: string, itemType: TypesEnum): string {
    const typeArray: string[] = fileType.split('/');
    const extension = typeArray[typeArray.length - 1];
    const milliString: string = new ObjectId().toString();
    return `${milliString}t${itemType}q.${extension}`;
  }

  returnValidTableString(type: TypesEnum): DatabaseTables {
    switch (Number(type)) {
      case TypesEnum.USER:
        return DatabaseTables.USERS;
      default:
        this.logger.error(`Did not find valid case for item type ${type} in returnValidTableString.`);
        throw new UnprocessableEntityException('This item does not support uploads');
    }
  }
}

//https://github.com/googleapis/nodejs-storage/blob/main/samples/uploadFromMemory.js
