FROM node:alpine

# Install pnpm globally
RUN npm install -g pnpm

WORKDIR /usr/src/app

COPY package.json .

RUN pnpm install

COPY . .

CMD ["pnpm", "run", "dev"]
