import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import helmet from 'helmet';
import { NestExpressApplication } from '@nestjs/platform-express';
import { ValidationPipe } from '@nestjs/common';
import { json, urlencoded } from 'express';
require('newrelic');
let server = null;
async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule, {
    cors: true,
  });
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
    }),
  );
  app.use(helmet());
  app.use(urlencoded({ extended: true, limit: '100kb' }));
  app.use(json({ limit: '100kb' }));
  app.enableShutdownHooks();
  const port = Number(process.env.PORT) || 8082;
  server = await app.listen(port);
  console.log(`server running on port ${port}`);
}
bootstrap();

process.on('uncaughtException', (error, origin) => {
  console.log(`\n${origin} signal received. \n${error}`);
});

process.on('unhandledRejection', (error) => {
  console.log(`signal received \n${error}`);
});

const gracefullShutdown = (event) => {
  return (code) => {
    console.log(`${event} received with ${code}`);
    server.close(() => {
      process.exit(code);
    });
  };
};

process.on('SIGINT', gracefullShutdown('SIGINT'));

process.on('SIGTERM', gracefullShutdown('SIGTERM'));

process.on('exit', (code) => {
  console.log('exit signal received ', code);
});
