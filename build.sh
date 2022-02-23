docker build backend -t smasherbackend:latest
docker tag smasherbackend colbeseder/smasherbackend:latest
docker push colbeseder/smasherbackend:latest

docker build prepareEntries -t smasher-entry-prep:latest
docker tag smasher-entry-prep colbeseder/smasher-entry-prep:latest
docker push colbeseder/smasher-entry-prep:latest



