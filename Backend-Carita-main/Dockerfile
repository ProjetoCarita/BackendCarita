# Dockerfile (single-stage)
FROM node:20-alpine

# Dependências nativas para compilar libs nativas (sqlite3/bcrypt etc.)
RUN apk add --no-cache python3 make g++

WORKDIR /app

# 1) Instala dependências com cache eficiente
COPY package*.json ./
RUN npm ci

# 2) Copia o restante do projeto
COPY tsconfig.json ./
COPY src ./src
COPY .sequelizerc ./
COPY migrations ./migrations
COPY config ./config
# Se tiver swagger-output.json no repo, descomente:
COPY swagger-output.json ./

# 3) Compila TypeScript (gera dist/ ou o outDir que estiver no seu tsconfig)
RUN npm run build

# 4) Porta
EXPOSE 3000

# 5) Variáveis default (sobrescreva no runtime)
ENV NODE_ENV=production \
    PORT=3000

# 6) Roda migrations e inicia o servidor
# Se seu outDir NÃO for "dist", ajuste o caminho do .js abaixo.
CMD ["sh", "-lc", "npx sequelize-cli db:migrate --env production && node dist/server.js"]
