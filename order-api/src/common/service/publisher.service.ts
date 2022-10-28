import { WinstonLevels } from '../class/winston-levels.enum';
import { LoggerWinstonService } from './logger-winston.service';
import { PubSub } from '@google-cloud/pubsub';
import { Injectable } from '@nestjs/common';

@Injectable()
export class PublisherService {
  private readonly projectId = String(process.env.PROJECT_ID);
  private readonly topicNameOrId = String(process.env.TOPIC_ORDER);
  private pubSubClient: PubSub;

  constructor(private readonly logger: LoggerWinstonService) {
    this.pubSubClient = new PubSub({
      projectId: this.projectId,
      credentials: {
        private_key: process.env.PRIVATE_KEY,
        client_id: process.env.CLIENT_ID,
      },
    });
  }

  public async publishMessage(message: any) {
    try {
      const messageStringify = JSON.stringify(message);
      const dataBuffer = Buffer.from(messageStringify);
      const messageId = await this.pubSubClient
        .topic(this.topicNameOrId)
        .publishMessage({ data: dataBuffer });
      this.logger.log(WinstonLevels.Info, `Message ${messageId}`);
    } catch (error) {
      this.logger.log(WinstonLevels.Error, JSON.stringify(error));
    }
  }
}
