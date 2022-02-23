docker build --tag colbeseder/smasherbackend:latest -f backend/Dockerfile .
docker push colbeseder/smasherbackend:latest

docker build --tag colbeseder/smasherfrontend:latest -f frontend/Dockerfile .
docker push colbeseder/smasherfrontend:latest

docker build --tag colbeseder/smasher-entry-prep:latest -f prepareEntries .
docker push colbeseder/smasher-entry-prep:latest