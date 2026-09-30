FROM node:22-alpine AS build
WORKDIR /site
COPY . .
RUN node build.js

FROM nginx:stable-alpine
RUN rm -rf /usr/share/nginx/html/*
COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=build /site/dist/ /usr/share/nginx/html/
EXPOSE 80 3000
HEALTHCHECK --interval=15s --timeout=3s --start-period=5s --retries=3 \
  CMD wget -q --spider http://127.0.0.1:80/health || exit 1
CMD ["nginx", "-g", "daemon off;"]
