FROM node:18

WORKDIR /usr/src/app

COPY server/ ./

RUN npm install

RUN npm run build

EXPOSE 80
CMD [ "nest", "start" ]
