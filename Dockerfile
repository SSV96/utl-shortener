# Use the official Node.js image
FROM node:22-alpine

# Set the working directory
WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install -g @nestjs/cli && npm ci

# Copy the rest of the application
COPY . .

# Build the NestJS app
RUN npx nest build

# Expose the application port
EXPOSE 3000

# Start the application
CMD ["node", "dist/main.js"]
