# Stage 0, based on Node.js, to build and compile Angular
FROM node:9.11 as node
LABEL maintainer="Brian May <brian@linuxpenguins.xyz>"
WORKDIR /app
COPY package.json yarn.lock /app/
RUN yarn install --no-progress
COPY ./ /app/
ARG ng_arg="--prod --build-optimizer"
RUN ./node_modules/.bin/ng build $ng_arg

# Stage 1, based on Nginx, to have only the compiled app, ready for production with Nginx
FROM nginx:1.13
COPY --from=node /app/dist/ /usr/share/nginx/html
COPY ./nginx-custom.conf /etc/nginx/conf.d/default.conf
