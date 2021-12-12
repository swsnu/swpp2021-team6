FROM node:16.3
WORKDIR /app
COPY package.json yarn.lock ./
RUN npm install -g npm && yarn set version latest && yarn install
COPY . ./