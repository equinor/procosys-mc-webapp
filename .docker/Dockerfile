# build environment
FROM node:16.7.0 as build
WORKDIR /app
COPY . /app
RUN yarn install
RUN yarn build --mode=production

# production environment
FROM nginx:1.21.1-alpine
## add permissions for nginx user
RUN mkdir -p /usr/share/nginx/html/mc
COPY --from=build /app/build /usr/share/nginx/html/mc
COPY .docker/nginx/ /etc/nginx/
COPY  .docker/scripts/ /etc/scripts/
EXPOSE 5000
CMD ["sh","/etc/scripts/startup.sh"]
