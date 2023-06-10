import { initMongoDatabase } from './mongo';
import { Logger } from '@nestjs/common';

export async function initializeDatabase(databaseProvider: 'MONGO'): Promise<any> {
  if (databaseProvider === 'MONGO') {
    try {
      return await initMongoDatabase();
    } catch (e) {
      Logger.error(e);
    }
  } else {
    throw new Error('Not a valid database provider');
  }
}
