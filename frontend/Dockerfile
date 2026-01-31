FROM node:20-alpine

RUN npm install -g pnpm

WORKDIR /app

COPY pnpm-lock.yaml package.json ./
RUN pnpm install

COPY . .

EXPOSE 3000

CMD ["pnpm", "dev"]
