FROM node:21-alpine3.18 as builder

WORKDIR /app

COPY . /app

RUN npm install

RUN npm run build

FROM ubuntu

RUN apt-get update

RUN apt-get install nginx -y

COPY --from=builder /app/dist /var/www/html/

EXPOSE 80
EXPOSE 443

CMD ["nginx","-g","daemon off;"]