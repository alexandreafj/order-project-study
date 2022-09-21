# order-project-study
This project is meant to study GCP services such as (Cloud Run, Pub/Sub), CI/CD and others as load tests(k6), metrics(new relic) and terraform.

## Initialize the application
The command bellow will start the aplication, create everything you need to start using this application.
```
docker-compose up
```

## Running local unit tests
Reach by terminal the api folder and execute:
```
npm ci --silent
npm t
```

## Tech Stack

- [Docker](https://docs.docker.com/engine/install/ubuntu/)
- [CloudRun](https://cloud.google.com/run/docs/quickstarts/deploy-container)
- [Nestjs](https://docs.nestjs.com)
- [Terraform](https://www.terraform.io)
- [NewRelic](https://newrelic.com)
- [K6](https://k6.io/docs/)
