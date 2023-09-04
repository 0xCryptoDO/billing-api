FROM node:17

WORKDIR /home/billing-api

COPY package.json .

RUN yarn install

COPY . .

RUN yarn build

EXPOSE 3002

CMD ["yarn", "start:prod"]