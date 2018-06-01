FROM node:9.11.1-jessie
COPY . ~/src/
WORKDIR ~/src/
RUN npm install
RUN npm test -- --coverage
RUN npm run build

FROM nginx
COPY --from=0 /src/build /usr/share/nginx/html
