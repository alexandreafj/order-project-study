import { Injectable } from '@nestjs/common';
import { createLogger, transports, format, Logger } from 'winston';
import { WinstonLevels } from '../class/winston-levels.enum';

@Injectable()
export class LoggerWinstonService {
  private readonly logger: Logger;

  constructor() {
    this.logger = createLogger({
      transports: [new transports.Console()],
      format: format.combine(
        format.colorize(),
        format.timestamp(),
        format.printf(({ timestamp, level, message }) => {
          return `[${timestamp}] ${level}: ${message}`;
        }),
      ),
    });
  }

  public log(level: WinstonLevels, message: string) {
    this.logger.log({
      level,
      message,
    });
  }
}
