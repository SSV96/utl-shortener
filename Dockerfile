# Use an official Node.js runtime as a parent image
FROM node:22-alpine AS builder

# Set working directory inside the container
WORKDIR /usr/src/app

# Copy package.json and package-lock.json to leverage Docker's layer caching
COPY package*.json ./

# Install dependencies
RUN npm install --omit=dev

# Copy the entire source code
COPY . .

# Build the NestJS application
RUN npm run build

# Create a minimal production image
FROM node:22-alpine AS runner

# Set working directory
WORKDIR /usr/src/app

# Copy only necessary files from the builder stage
COPY --from=builder /usr/src/app/package*.json ./
COPY --from=builder /usr/src/app/node_modules ./node_modules
COPY --from=builder /usr/src/app/dist ./dist
COPY --from=builder /usr/src/app/.env .env

# Expose the port the app runs on
EXPOSE 3001

# Run the application
CMD ["node", "dist/main"]
