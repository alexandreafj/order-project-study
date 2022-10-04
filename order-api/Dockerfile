FROM node:18-alpine

RUN \
apk update && \
apk upgrade && \
apk add --upgrade dumb-init && \
apk add git

WORKDIR /order-api

RUN chown -R node /order-api

USER node

COPY --chown=node:node ["package.json", "package-lock.json", "./"]

RUN npm ci --silent

COPY --chown=node:node . .

CMD ["dumb-init", "npm", "run", "start:prod"]