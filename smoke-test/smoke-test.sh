google-chrome --headless --dump-dom http://cota-streaming-ui > test-results.txt &

until grep -qP ".*" test-results.txt; do sleep 1; echo "waiting for DOM"; done

BUS_AMOUNT=$(grep -o leaflet-marker test-results.txt| wc -l)

if [ $BUS_AMOUNT -eq 0 ]
then
    echo "no busses found" && exit 1
else
    echo "got $BUS_AMOUNT busses"
fi