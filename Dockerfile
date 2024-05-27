# Build environment
FROM node:20.0.0 as build
WORKDIR /app
COPY . /app
RUN yarn install
RUN yarn build --mode=production

# Production environment
FROM nginxinc/nginx-unprivileged
## Add permissions for nginx user

WORKDIR /app
## Add permissions for nginx user
COPY --from=build /app/build /usr/share/nginx/html/mc
COPY .docker/nginx/ /etc/nginx/
COPY .docker/scripts/ /etc/scripts/

# Change the user from root to non-root - From now on, all Docker commands are run as non-root user (except for COPY)
USER 0
RUN chown -R nginx /usr/share/nginx/html/mc \
    && chown -R nginx /etc/nginx/conf.d
USER 9999

EXPOSE 5000

CMD ["sh","/etc/scripts/startup.sh"]
