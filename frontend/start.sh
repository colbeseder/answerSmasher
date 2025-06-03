source constants.sh
npm run build

# Set api URL to the local version
if [ $IS_LOCAL ] ; then echo "window.apiUrl = 'http://127.0.0.1:30182'; " > del0 ;
cat del0 ./static/scripts/common.js > del1 ;
mv del1 ./static/scripts/common.js
fi

node app.js $API_Gateway