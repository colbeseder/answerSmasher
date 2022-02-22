docker pull mongo
docker run -d -p 27017-27019:27017-27019 --name mongodb mongo
source constants.sh
cd backend
bash start.sh &
cd ..
cd prepareEntries
node app.js &