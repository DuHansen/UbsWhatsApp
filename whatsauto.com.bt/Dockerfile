# Imagem base do Node.js
FROM node:22.8

# Instala as dependências necessárias para o Puppeteer e o Chromium
RUN apt-get update && apt-get install -y \
    libnss3 \
    libgdk-pixbuf2.0-0 \
    libatk-bridge2.0-0 \
    libatk1.0-0 \
    libcups2 \
    libx11-xcb1 \
    libxcomposite1 \
    libxdamage1 \
    libxrandr2 \
    libgbm1 \
    libasound2 \
    libnspr4 \
    libxss1 \
    libappindicator3-1 \
    libnss3-dev \
    libglib2.0-0 \
    && rm -rf /var/lib/apt/lists/*  # Limpeza de cache para reduzir o tamanho da imagem

# Define o diretório de trabalho
WORKDIR /app

# Copia o package.json e package-lock.json (se existir) para o container
COPY package*.json ./

# Instala as dependências do Node.js
RUN npm install

# Copia o restante do código da aplicação
COPY . .

# Expõe a porta
EXPOSE 3000

# Comando para iniciar a aplicação
CMD ["npm", "start"]
