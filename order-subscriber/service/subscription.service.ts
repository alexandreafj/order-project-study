import { PubSub, Subscription, Message } from '@google-cloud/pubsub';
import { WinstonLevels } from '../class/winston-levels.enum';
import { LoggerWinstonService } from './logger-winston.service';

export class SubscriptionService {
    private readonly projectId = String(process.env.PROJECT_ID);
    private readonly subscriptionName = String(process.env.ORDER_SUBSCRIPTION_NAME);
    private pubSubClient: PubSub;
    private logger: LoggerWinstonService;
    private subscription: Subscription;

    constructor() {
        this.logger = new LoggerWinstonService();
        this.pubSubClient = new PubSub({
            projectId: this.projectId,
            credentials: {
                private_key: process.env.PRIVATE_KEY,
                client_id: process.env.CLIENT_ID,
            }
        });
        this.subscription = this.pubSubClient.subscription(this.subscriptionName);
    }

    public listenForMessages() {
        console.log(this.subscription);
        try {
            this.subscription.on('message', this.messageHandler);
            this.subscription.on('error', this.errorHandler);
        } catch (error) {
            this.logger.log(WinstonLevels.Error, JSON.stringify(error));
            this.subscription.removeListener('message', this.messageHandler);
            this.subscription.removeListener('error', this.errorHandler);
            this.subscription.close();
        }
    }

    private messageHandler(message: Message) {
        this.logger.log(WinstonLevels.Info, `Received message ${message.id}:`);
        this.logger.log(WinstonLevels.Info, `Data: ${message.data}`);
        this.logger.log(WinstonLevels.Info, `Attributes: ${message.attributes}`);
        message.ack();
    }

    private errorHandler(error: any) {
        this.logger.log(WinstonLevels.Error, JSON.stringify(error));
        throw error;
    }

    public closeSubscription() {
        this.subscription.close();
    }
}