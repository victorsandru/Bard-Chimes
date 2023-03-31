FROM node:18-alpine
ENV NODE_ENV=production

WORKDIR /src

COPY ["src/package.json", "src/package-lock.json*", "./"]

RUN npm install --production

COPY . .

RUN node src/deploy-commands.js

CMD [ "node", "src/index.js" ]