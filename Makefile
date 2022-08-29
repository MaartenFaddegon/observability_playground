todobackend:
	docker build -t todo-backend -f docker/todobackend.Dockerfile ./todo-backend

run:
	docker run --rm todo-backend
