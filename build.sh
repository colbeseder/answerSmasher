cp constants.sh backend
docker build backend -t smasherbackend:latest
docker tag smasherbackend colbeseder/smasherbackend:latest
docker push colbeseder/smasherbackend:latest

cp constants.sh frontend
docker build frontend -t smasherfrontend:latest
docker tag smasherfrontend colbeseder/smasherfrontend:latest
docker push colbeseder/smasherfrontend:latest

cp constants.sh prepareEntries
docker build prepareEntries -t smasher-entry-prep:latest
docker tag smasher-entry-prep colbeseder/smasher-entry-prep:latest
docker push colbeseder/smasher-entry-prep:latest