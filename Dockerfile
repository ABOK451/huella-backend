# Usa imagen base de Node
FROM node:18-alpine

# Crea carpeta de trabajo
WORKDIR /app

# Copia package.json y package-lock.json
COPY package*.json ./

# Instala dependencias
RUN npm install --production

# Copia el resto del código
COPY . .

# Expón el puerto en que corre tu app
EXPOSE 4000

# Comando para iniciar la app
CMD ["npm", "start"]
