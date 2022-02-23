minikube start
kubectl apply -f k8s-files
sleep 200
kubectl port-forward service/apigate 3000:3000 --namespace backend-namespace &
kubectl port-forward service/ui-service 3001:3001 &