google-chrome --headless --no-sandbox --dump-dom http://cota-streaming-ui.default:8080 2> /dev/null > test-results.txt &

until grep -qP ".*" test-results.txt; do sleep 1; echo "waiting for DOM"; done

cat test-results.txt

BUS_AMOUNT=$(grep -o leaflet-marker-icon test-results.txt| wc -l)

if [ $BUS_AMOUNT -eq 0 ]
then
    echo "no busses found" && exit 1
else
    echo "got $BUS_AMOUNT busses"
fi