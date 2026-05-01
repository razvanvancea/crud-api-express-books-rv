FROM node:lts
WORKDIR /app
COPY . .
RUN npm install
EXPOSE 3001
CMD ["node", "index.js"]
