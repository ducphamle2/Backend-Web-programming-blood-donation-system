FROM node

WORKDIR /app

COPY ./ /app

RUN npm install

RUN npm install -g nodemon

EXPOSE 8080

CMD ["nodemon", "server.js"]



