FROM lenaten/headless-chrome

ENV ENDPOINT_URL=cota-streaming-ui.default:8080

COPY smoke-test.sh .

ENTRYPOINT "./smoke-test.sh"
