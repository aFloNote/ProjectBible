DB_DOCKER_CONTAINER=raven_postGresContainer
BINARY_NAME=ravenapi
DSN="host=localhost port=5432 user=root password=secret dbname=raven_db sslmode=disable timezone=UTC timeout=10"

# creating the ravendb inside postgres container
createdb:
	docker exec -it $(DB_DOCKER_CONTAINER) createdb --username=root --owner=root raven_db
# creating the container with postgres software
postgres:
	docker run --name $(DB_DOCKER_CONTAINER) -p 5432:5432 -e POSTGRES_USER=root -e POSTGRES_PASSWORD=secret -d postgres:12-alpine
# creating the database inside the postgres container
create_migrations:
	migrate create -ext sql -dir migrations init_schema
# migrate up
migrate-up:
	migrate -path migrations -database "postgresql://root:secret@localhost:5432/raven_db?sslmode=disable" -verbose up

# migrate down
migrate-down:
		migrate -path migrations -database "postgresql://root:secret@localhost:5432/raven_db?sslmode=disable" -verbose down			

# look at schema
dbdSchema:
		psql -h localhost -U root -d raven_db -c "\d"

#start docker container
start-docker:
	docker start $(DB_DOCKER_CONTAINER)
#stop docker container
stop-containers:
	@echo "stopping all containers"
	@if [ $$(docker ps -q) ]; then \
		echo "found and stopped"; \
		docker stop $$(docker ps -q); \
	else \
		echo "no containers found"; \
	fi



build:
	@echo "building binary"
	@if [ -f $(BINARY_NAME) ]; then \
		rm $(BINARY_NAME); \
	fi
	go build -o $(BINARY_NAME) cmd/server/*.go;
	@echo "build complete"

run: build
	@echo "running binary"
	./$(BINARY_NAME)
stop:
	@echo "stopping binary"
	@-pkill -SIGTERM -f "./$(BINARY_NAME)"


# The default command (just typing `make` will run `make build`).
default: build

# Builds Docker containers.
build-docker:
	docker-compose build

# Starts Docker containers.
up:
	docker-compose up -d

# Stops Docker containers.
down:
	docker-compose down

# Removes Docker containers, networks, volumes, and images.
clean:
	docker-compose down -v --rmi all --remove-orphans

# View logs of running containers.
logs:
	docker-compose logs -f

# SSH into the "raven" container.
ssh-raven:
	docker-compose exec raven sh

# SSH into the "crow" container.
ssh-crow:
	docker-compose exec crow sh

# Rebuild and restart containers.
rebuild: build up

	
