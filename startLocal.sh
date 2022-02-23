minikube start
kubectl apply -f k8s-files
sleep 120
kubectl port-forward service/apigate 3000:3000 --namespace backend-namespace