FROM node:22-slim

RUN apt-get update && apt-get install -y \
    chromium \
    fonts-ipafont-gothic fonts-wqy-zenhei fonts-thai-tlwg fonts-kacst fonts-freefont-ttf libxss1 \
    unzip \
    tar \
    fontconfig \
    libgl1-mesa-glx \
    libgl1-mesa-dri \
    libegl1-mesa \
    libgles2-mesa \
    --no-install-recommends \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /app
RUN mkdir -p /usr/share/fonts/apple
COPY public/AppleColorEmoji.ttc /usr/share/fonts/apple/
RUN fc-cache -f -v

ENV PUPPETEER_SKIP_CHROMIUM_DOWNLOAD=true
ENV PUPPETEER_EXECUTABLE_PATH=/usr/bin/chromium

COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

EXPOSE 3000
CMD ["npm", "start"]