# Multi-stage build for Hugo static site

# Stage 1: Build with Node.js (for Tailwind CSS)
FROM node:20-alpine AS node-builder

WORKDIR /app

# Copy package files
COPY package.json ./

# Install dependencies with npm (simpler for Docker builds)
RUN npm install

# Copy source files
COPY . .

# Build Tailwind CSS
RUN npm run build:css

# Stage 2: Build with Hugo
FROM klakegg/hugo:0.111.3-alpine AS hugo-builder

WORKDIR /app

# Copy everything from node builder
COPY --from=node-builder /app /app

# Build Hugo site
RUN hugo --minify

# Stage 3: Serve with nginx
FROM nginx:1.25-alpine

# Copy built site from hugo builder
COPY --from=hugo-builder /app/public /usr/share/nginx/html

# Copy custom nginx config
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Expose port 80
EXPOSE 80

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD wget --quiet --tries=1 --spider http://localhost/ || exit 1

# Start nginx
CMD ["nginx", "-g", "daemon off;"]
