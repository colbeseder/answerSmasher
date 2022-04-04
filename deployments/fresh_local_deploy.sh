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

helm secrets install dev ./deployments/chart -n smasher-ns-local --create-namespace --values ./deployments/local_secrets.yml --values ./deployments/local_values.yaml

sleep 30
kubectl port-forward svc/apigate 30182:80 --namespace smasher-ns-local &
minikube service ui-service --namespace smasher-ns-local
