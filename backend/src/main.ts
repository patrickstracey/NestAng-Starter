import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { INestApplication, Logger, ValidationPipe } from '@nestjs/common';
import { initMongoDatabase, MongoService } from './database/mongo';
import { environment } from '../environments/environment';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    rawBody: true,
  });
  setupDatabase(app);
  app.setGlobalPrefix('api');
  app.enableCors();
  app.useGlobalPipes(
    new ValidationPipe({ whitelist: true, disableErrorMessages: false }),
  );
  await app.listen(process.env.port || 3000, () => {
    Logger.log(`BUILD :::: ${environment.name}`);
  });
}

function setupDatabase(app: INestApplication) {
  initMongoDatabase((err, db) => {
    if (err) {
      Logger.error('Failed to Connect to Mongo Database, is it running?');
      Logger.error(err);
    } else {
      app.get(MongoService).assignDatabase(db);
    }
  });
}

bootstrap();
