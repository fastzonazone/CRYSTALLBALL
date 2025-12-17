# ---- Build stage ----
FROM node:20-alpine AS builder
WORKDIR /app

# Install dependencies
COPY frontend/package*.json ./
RUN npm ci

# Copy source and build
# Copy source and build
COPY frontend .
ARG VITE_API_URL
ENV VITE_API_URL=$VITE_API_URL
RUN npm run build   # produces ./dist

# ---- Runtime stage (nginx) ----
FROM nginx:alpine
COPY --from=builder /app/dist /usr/share/nginx/html
EXPOSE 80
