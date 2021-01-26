FROM node:15-alpine

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm ci

COPY . .

RUN npm run build

EXPOSE 80

CMD ["npm", "run", "start"]
