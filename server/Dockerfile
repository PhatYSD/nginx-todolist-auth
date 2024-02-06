FROM node:21-alpine3.18

WORKDIR /app

COPY package*.json /app/

RUN npm install

COPY . .

RUN npx prisma generate

RUN npm run build

EXPOSE 5000

CMD ["npm", "start"]