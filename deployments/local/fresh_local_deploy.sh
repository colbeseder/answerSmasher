minikube delete
minikube start

kubectl apply -f ./deployments/local/mongo.yml

eval $(minikube docker-env)
minikube addons enable ingress
minikube addons enable ingress-dns

npm install package.json
npm run build --prefix ./frontend

docker build --tag colbeseder/smasherfrontend:local -f frontend/Dockerfile .
docker build --tag colbeseder/smasherbackend:local -f backend/Dockerfile .
docker build --tag colbeseder/smasher-entry-prep:local -f prepareEntries/Dockerfile .
kubectl apply -f ./deployments/local/smasher-namespace.yml
kubectl apply -f ../secrets/local/secrets.yml
kubectl apply -f ./deployments/local

sleep 30
kubectl port-forward svc/apigate 30182:80 --namespace smasher-ns &
minikube service ui-service --namespace smasher-ns