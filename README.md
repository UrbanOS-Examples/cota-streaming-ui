This application is dependent on being fed websocket data. The host/port for the websocket can be found in `public/config.[ENV.]js`

## Install Dependencies
`npm install`

## Run Unit Tests
`npm test`

Unit tests will output warnings relate to accessibility. Configurations
are found in `test-start-point.js`

## Lint the Code
`npm run lint`

## Start the UI Locally
`npm run start-dev`

## Build Docker Image
`docker build . -t <image name>:<tag>`

## Running the Docker Image
`docker run -d --rm -p <port>:80 -e env={dev|prod} <image name>:<tag>`
