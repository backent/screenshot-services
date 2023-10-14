# build stage
FROM node:14.21.3-alpine3.16 as build-stage
RUN apk update && apk add --no-cache --virtual \
    .build-deps \
    udev \
    ttf-opensans \
    chromium \
    ca-certificates

RUN apk add --no-cache \
        nss \
        freetype \
        freetype-dev \
        harfbuzz \
        ca-certificates \
        ttf-freefont
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
# Set environment variable to use Chromium from the correct location
ENV PUPPETEER_EXECUTABLE_PATH="/usr/bin/chromium-browser"

EXPOSE 3000
CMD ["npm", "run", "start"]
