minikube start
kubectl apply -f k8s-files
kubectl port-forward service/apigate 3000:3000 --namespace backend-namespace