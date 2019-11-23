FROM node:10

WORKDIR /app

COPY . /app

RUN npm i

EXPOSE 8080

CMD ["npm", "start"]

