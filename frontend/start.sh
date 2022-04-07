source constants.sh

echo '/* Built at' $( date -u ) '*/' | tee del0

# Set api URL to the local version
if [ "$IS_PROD" = "no" ] ; then echo "window.apiUrl = 'http://127.0.0.1:30182'; " >> del0 ;
echo "Local deployment"
fi

cat del0 ./static/scripts/common.js > del1 ;
mv del1 ./static/scripts/common.js

node app.js $API_Gateway
