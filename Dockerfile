FROM node:alpine AS build

WORKDIR /build

ADD . .

RUN yarn install
RUN yarn build

FROM node:alpine

WORKDIR /app

ENV NODE_ENV production

ADD . .
COPY --from=build /build/dist ./dist

RUN yarn install --production

EXPOSE 8503

CMD node server.js
