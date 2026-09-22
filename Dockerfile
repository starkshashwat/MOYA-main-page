FROM nginx:alpine

# Remove default nginx static assets
RUN rm -rf /usr/share/nginx/html/*

# Copy custom nginx configuration (listens on both 80 and 3000)
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Copy production files
COPY index.html styles.css main.js /usr/share/nginx/html/
COPY assets/ /usr/share/nginx/html/assets/

# Expose both ports so Coolify works with either 80 or 3000
EXPOSE 80 3000

# Built-in container healthcheck using Alpine wget
HEALTHCHECK --interval=15s --timeout=3s --start-period=5s --retries=3 \
  CMD wget -q --spider http://127.0.0.1:80/health || wget -q --spider http://127.0.0.1:3000/health || exit 1

CMD ["nginx", "-g", "daemon off;"]
