import { SubscriptionService } from "./service/subscription.service";

const subscriptionService = new SubscriptionService();

function main() {
    console.log('Running');
    //subscriptionService.listenForMessages();
    setTimeout(() => {
        console.log(`one message(s) received.`);
    }, 1000);
}

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
const gracefullShutdown = (event: any) => {
    return (code: number) => {
        console.log(`${event} received with ${code}`);
        // assure that no client is going to request any in this period
        // but if that's someone using, wait until finish
        subscriptionService.closeSubscription();
    };
};

// trigger when CTRL + C on terminal -> multi platform
process.on('SIGINT', gracefullShutdown('SIGINT'));

// trigger when kill the process
process.on('SIGTERM', gracefullShutdown('SIGTERM'));

process.on('exit', (code) => {
    console.log('exit signal received ', code);
});

main();