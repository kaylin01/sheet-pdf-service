# FROM node:20-slim
# WORKDIR /app
# COPY package*.json ./
# RUN npm ci --omit=dev
# COPY . .
# CMD ["npm","start"]
# Use Node.js LTS version
FROM node:18

# Create app directory
WORKDIR /usr/src/app

# Install app dependencies
COPY package*.json ./
RUN npm install

# Copy the app source code
COPY . .

# Expose port
EXPOSE 8080

# Run the app
CMD [ "node", "server.js" ]
