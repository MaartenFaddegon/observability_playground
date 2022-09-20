up:
	tilt up

todobackend:
	docker build -t todo-backend -f docker/todobackend.Dockerfile ./todo-backend

run:
	docker run --rm todo-backend

cluster-up:
	kind create cluster --config cluster-config.yaml

cluster-down:
	kind delete cluster
