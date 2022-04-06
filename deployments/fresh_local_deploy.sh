minikube delete
minikube start
helm uninstall dev -n smasher-ns-local

eval $(minikube docker-env)
minikube addons enable ingress
minikube addons enable ingress-dns

minikube image load mongo
kubectl apply -f ./deployments/mongo.yml

minikube image load node:16 #frontend & backend & prepareEntries
minikube image load python:3.8-slim-buster # Combiner

npm install package.json
npm run build --prefix ./frontend

docker build --tag colbeseder/smasherfrontend:local -f frontend/Dockerfile .
docker build --tag colbeseder/smasherbackend:local -f backend/Dockerfile .
docker build --tag colbeseder/smasher-entry-prep:local -f prepareEntries/Dockerfile .
docker build --tag colbeseder/smasher-combiner:local -f combiner/Dockerfile .

helm secrets upgrade --install dev ./deployments/chart -n smasher-ns-local --create-namespace --values ./deployments/local_secrets.yml --values ./deployments/local_values.yaml

sleep 30
kubectl port-forward svc/apigate 30182:80 --namespace smasher-ns-local &
minikube service ui-service --namespace smasher-ns-local
