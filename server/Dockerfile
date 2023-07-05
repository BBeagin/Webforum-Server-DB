FROM node:18
ENV NODE_ENV=development

WORKDIR /app

COPY ["package.json","package-lock.json","./"]

COPY package.json ./
COPY package-lock.json ./

RUN npm install --development

CMD ["node", "server.js"]