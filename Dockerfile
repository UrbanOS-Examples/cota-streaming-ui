FROM node:9.11.1-jessie
COPY . /build
WORKDIR /build
RUN npm install
RUN npm test -- --coverage 
RUN npm run build

FROM nginx
COPY --from=0 /build/build /usr/share/nginx/html 
