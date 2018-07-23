#!/usr/bin/env bash
set -e

delete-smoke-test-resources() {
    kubectl delete -f k8s/ \
        2>/dev/null \
        || echo "no smoke test deployments to delete"
}

if ! minikube status; then
    minikube start --memory 8192
fi

eval $(minikube docker-env)

delete-smoke-test-resources
trap "delete-smoke-test-resources" EXIT

# manually change the k8s/01-deployment.yaml to `imagePullPolicy: Never` and to use this local image
docker build -t scos/cota-streaming-ui-smoke-test:local .

kubectl apply -f k8s/

until kubectl logs -f cota-ui-smoke-tester 2>/dev/null; do
  echo "waiting for smoke test docker to start"
  sleep 1
done

kubectl --output=json get pod cota-ui-smoke-tester \
    | jq -r '.status.phase' \
    | grep -qx "Succeeded"


