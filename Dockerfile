FROM node:21.2-alpine3.18
WORKDIR /promotion-web
COPY package.json /promotion-web
RUN yarn install
COPY . /promotion-web
CMD ["yarn", "run", "start"]