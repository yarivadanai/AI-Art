import { Logger, ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module.js';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { bufferLogs: true });
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      forbidUnknownValues: true,
    }),
  );

  const port = process.env.PORT ? parseInt(process.env.PORT, 10) : 3333;
  await app.listen(port);
  Logger.log(`Authority API listening on http://localhost:${port}`, 'Bootstrap');
}

bootstrap().catch((error) => {
  Logger.error(error, 'Bootstrap');
  process.exit(1);
});
