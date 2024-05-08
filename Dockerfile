FROM node:20.8.1-bullseye-slim
ENV NODE_ENV=production
ENV PORT=8080

WORKDIR /app

COPY ["package.json", "./"]

RUN npm install

COPY . .

EXPOSE 8080

CMD [ "node", "index.js" ]
