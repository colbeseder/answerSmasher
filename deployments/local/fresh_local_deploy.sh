minikube delete
minikube start

eval $(minikube docker-env)
minikube addons enable ingress
minikube addons enable ingress-dns

minikube image load mongo
kubectl apply -f ./deployments/local/mongo.yml

npm install package.json
npm run build --prefix ./frontend

docker build --tag colbeseder/smasherfrontend:local -f frontend/Dockerfile .
docker build --tag colbeseder/smasherbackend:local -f backend/Dockerfile .
docker build --tag colbeseder/smasher-entry-prep:local -f prepareEntries/Dockerfile .

cd ./deployments/local/localchart
helm secrets install yo-yo . -n smasher-ns2 --create-namespace --values ../secrets.yml

sleep 30
kubectl port-forward svc/apigate 30182:80 --namespace smasher-ns &
minikube service ui-service --namespace smasher-ns