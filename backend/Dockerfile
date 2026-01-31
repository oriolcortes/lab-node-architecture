FROM node:20-alpine

# Instalar pnpm globalmente
RUN npm install -g pnpm

WORKDIR /app

# Copiar dependencias y lockfile
COPY pnpm-lock.yaml package.json ./

# Instalar dependencias (sin dev en producción)
RUN pnpm install

# Copiar todo el código fuente
COPY . .

EXPOSE 4000

# Comando por defecto para desarrollo
CMD ["pnpm", "dev"]
# Para producción, usar:
# pnpm run build
# CMD ["pnpm", "start"]
