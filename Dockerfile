FROM nginx:alpine

# Remove default nginx html files
RUN rm -rf /usr/share/nginx/html/*

# Copy custom nginx configuration
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Copy all static assets to Nginx html directory
COPY . /usr/share/nginx/html/

# Expose standard HTTP port
EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
