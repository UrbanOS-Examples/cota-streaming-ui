google-chrome \
    --headless \
    --no-sandbox \
    --dump-dom http://${ENDPOINT_URL} 2> /dev/null > test-results.txt &

until grep -qP ".*" test-results.txt; do sleep 1; echo "waiting for DOM"; done

cat test-results.txt
CONTAINER_COUNT=$(grep -o leaflet-container test-results.txt| wc -l)

if [ $CONTAINER_COUNT -eq 0 ]
then
    echo "DOM didn't load" && exit 1
else
    echo "got $CONTAINER_COUNT containers"
fi
