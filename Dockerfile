FROM node:18-alpine
ENV NODE_ENV=production

WORKDIR /src

COPY ["package.json", "package-lock.json*", "./"]

RUN npm install --production

COPY . .

RUN node deploy-commands.js

CMD [ "node", "index.js" ]