FROM node:20-alpine

WORKDIR /app

# Copie des fichiers de dépendances
COPY package*.json ./
COPY pnpm-lock.yaml ./

# Installation de pnpm et des dépendances
RUN npm install -g pnpm
RUN pnpm install

# Copie du code source
COPY . .

# Exposition du port
EXPOSE 3000

# Commande par défaut pour le développement
CMD ["pnpm", "run", "dev", "--host"]

