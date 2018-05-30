FROM node:10.3.0-alpine
COPY . ~/src/
WORKDIR ~/src/
RUN npm install
RUN npm run build
RUN npm test

FROM nginx
COPY --from=0 ~/src/build /usr/share/nginx/html
COPY --from=0 ~/src/run.sh /usr/share/nginx/html
WORKDIR /etc/nginx
CMD ["/usr/share/nginx/html/run.sh"]
