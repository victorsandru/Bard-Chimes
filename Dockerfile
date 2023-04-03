FROM node:18-alpine
ENV NODE_ENV=production

WORKDIR /

COPY ["package.json", "package-lock.json*", "./"]

RUN npm install --production

COPY . .

RUN node deploy-commands.js

EXPOSE 8080

CMD [ "node", "index.js" ]