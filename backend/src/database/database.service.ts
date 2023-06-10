import { Injectable } from '@nestjs/common';
import { MongoService } from './mongo';

@Injectable()
export class DatabaseService extends MongoService {}
