FROM node:18

WORKDIR /usr/src/app

COPY . .

RUN npm install

RUN npm run build

RUN npm install --production

EXPOSE 3000
CMD [ "npm", "start" ]
