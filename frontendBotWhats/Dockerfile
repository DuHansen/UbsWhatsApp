# Imagem base do Node.js
FROM node:22.8

# Define o diretório de trabalho
WORKDIR /app

# Copia o código da aplicação
COPY . .

# Instala as dependências
RUN npm i

# Expondo a porta para o frontend
EXPOSE 5173

# Comando para iniciar o frontend (usando npm run dev)
CMD ["npm", "run", "dev"]
