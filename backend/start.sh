source constants.sh
echo $mongoURI
grep "^[a=z]\{3,\}" "common-words.txt" > resources/ordered_titles
cat resources/ordered_titles | shuf > resources/titles
sleep 3
node queueTitles.js $mongoURI &
node app.js $mongoURI
