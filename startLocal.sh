minikube start
kubectl apply -f secrets/secrets.yml
kubectl apply -f k8s-files/backend.yml
sleep 600
kubectl port-forward service/apigate 3000:3000 --namespace backend-namespace &
kubectl port-forward service/ui-service 3001:3001 &