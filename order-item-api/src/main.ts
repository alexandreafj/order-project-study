import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as csurf from 'csurf';
import helmet from 'helmet';
import { NestExpressApplication } from '@nestjs/platform-express';
import * as cookieParser from 'cookie-parser';
let server = null;
async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule, {
    cors: true,
  });
  app.use(helmet());
  app.use(cookieParser());
  app.use(csurf({ cookie: true }));
  server = await app.listen(process.env.PORT || 8080);
  console.log(`server running on port ${process.env.PORT || 8080}`);
}
bootstrap();

// capture errors not been handled
// if the system don't have this system is going to brake
process.on('uncaughtException', (error, origin) => {
  console.log(`\n${origin} signal received. \n${error}`);
});
// capture errors not been handled by promises
// if we don't have this the system don't warn us
process.on('unhandledRejection', (error) => {
  console.log(`signal received \n${error}`);
});

// gracefull shutdown
const gracefullShutdown = (event) => {
  return (code) => {
    console.log(`${event} received with ${code}`);
    // assure that no client is going to request any in this period
    // but if that's someone using, wait until finish
    server.close(() => {
      console.log('http server closed');
      console.log('db connection closed');
      process.exit(code);
    });
  };
};

// trigger when CTRL + C on terminal -> multi platform
process.on('SIGINT', gracefullShutdown('SIGINT'));

// trigger when kill the process
process.on('SIGTERM', gracefullShutdown('SIGTERM'));

process.on('exit', (code) => {
  console.log('exit signal received ', code);
});
