FROM node:18.19.1-alpine3.19 AS development

WORKDIR /usr/src/app

COPY package*.json ./
COPY yarn.lock ./

RUN yarn install

COPY . .

######################
# BUILD FOR PRODUCTION
######################
FROM node:18.19.1-alpine3.19 AS build

WORKDIR /usr/src/app

COPY package*.json ./
COPY yarn.lock ./

COPY --from=development /usr/src/app/node_modules ./node_modules

COPY . .

RUN yarn build

RUN yarn install --frozen-lockfile --production && yarn cache clean

######################
# PRODUCTION
######################
FROM node:18.19.1-alpine3.19 AS production

COPY --from=build /usr/src/app/node_modules ./node_modules
COPY --from=build /usr/src/app/dist ./dist

CMD ["node", "dist/main"]