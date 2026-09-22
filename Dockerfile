FROM nginx:alpine

# Remove default nginx static assets
RUN rm -rf /usr/share/nginx/html/*

# Copy custom nginx configuration
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Copy production files
COPY index.html styles.css main.js /usr/share/nginx/html/
COPY assets/ /usr/share/nginx/html/assets/

# Expose HTTP port
EXPOSE 80

# Built-in container healthcheck using Alpine wget
HEALTHCHECK --interval=20s --timeout=3s --start-period=5s --retries=3 \
  CMD wget -q --spider http://127.0.0.1:80/health || exit 1

CMD ["nginx", "-g", "daemon off;"]
