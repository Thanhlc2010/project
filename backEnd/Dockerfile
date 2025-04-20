# Build stage
FROM node:18-alpine AS builder

# Install OpenSSL and other build dependencies
RUN apk add --no-cache \
    openssl \
    libc6-compat

# Set working directory
WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies including dev dependencies
RUN npm install

# Copy Prisma schema
COPY prisma ./prisma/

# Generate Prisma client
RUN npx prisma generate

# Copy source code and TypeScript config
COPY tsconfig.json ./
COPY src ./src/

# Build TypeScript code
RUN npm run build

# Production stage
FROM node:18-alpine

# Install OpenSSL for Prisma
RUN apk add --no-cache \
    openssl \
    libc6-compat

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install production dependencies only
RUN npm install --omit=dev

# Copy Prisma client from builder
COPY --from=builder /app/node_modules/.prisma ./node_modules/.prisma
COPY --from=builder /app/node_modules/@prisma ./node_modules/@prisma
COPY --from=builder /app/prisma ./prisma

# Copy built JavaScript files
COPY --from=builder /app/dist ./dist

# Copy environment file if it exists
COPY .env* ./

# Expose API port
EXPOSE 3000

# Start the application
CMD ["npm", "start"]