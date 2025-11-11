# Stage 1: Build the application
FROM node:alpine AS build
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . ./
RUN npm run build


# Stage 2: Serve with Nginx
FROM nginx:alpine
COPY nginx.conf /etc/nginx/nginx.conf
COPY --from=build /app/dist /var/www
EXPOSE 3000
CMD ["nginx", "-g", "daemon off;"]