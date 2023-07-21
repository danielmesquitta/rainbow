FROM node:alpine

WORKDIR /usr/src/app

COPY server/ ./

RUN yarn

RUN yarn build

EXPOSE 8080
CMD [ "nest", "start" ]
