FROM node:12.5.0-alpine AS builder
COPY . /app/src
WORKDIR /app/src
RUN npm ci
RUN npm run build
RUN npm test

FROM nginx
RUN apt-get -y update &&\
    apt-get install -y nginx-extras
COPY --from=builder /app/src/dist /usr/share/nginx/html
COPY --from=builder /app/src/run.sh /run.sh
COPY ./default.conf /etc/nginx/conf.d/default.conf
WORKDIR /etc/nginx
CMD ["/run.sh"]
