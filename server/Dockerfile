FROM node:18
ENV NODE_ENV=development

WORKDIR /app

COPY ["package.json","package-lock.json","./"]

RUN npm install --development

CMD ["npm", "start"]