# # Use a imagem Node oficial como a imagem base
# FROM node:18-alpine

# # Defina o diretório de trabalho dentro do container
# WORKDIR /app

# # Copie os arquivos package.json e package-lock.json para o diretório de trabalho
# COPY package*.json ./

# # Instale as dependências da aplicação
# RUN npm install

# # Copie todos os arquivos do projeto para o diretório de trabalho do container
# COPY public public
# COPY src src

# # Exponha a porta que a aplicação vai rodar
# EXPOSE 3000

# # Comando para rodar a aplicação em modo de desenvolvimento
# CMD ["npm", "start"]