source constants.sh
grep "^[a-z]\{3,\}" "resources/common-words.txt" > resources/ordered_titles
cat resources/ordered_titles | shuf > resources/titles
sleep 3
node queueTitles.js &
node app.js