FROM node:18

WORKDIR /usr/src/app

COPY server/ ./

RUN npm install

RUN npm run build

EXPOSE 3000
CMD [ "npm", "start" ]
