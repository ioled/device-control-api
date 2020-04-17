FROM node:lts-alpine3.10

RUN apk add --update make

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

COPY google-cloud-service-account.json /

ENV GOOGLE_APPLICATION_CREDENTIALS="/google-cloud-service-account.json"

EXPOSE 5020

CMD ["make", "r"]
