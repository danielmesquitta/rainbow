FROM node:18

WORKDIR /usr/src/app

COPY server/ ./

RUN npm install

RUN npm run build

EXPOSE 8080
CMD [ "nest", "start" ]
