FROM node:22

WORKDIR /app

COPY . .

RUN npm install -g mintlify

EXPOSE 3000

CMD ["mintlify", "dev"]
