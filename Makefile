.PHONY: build tag push

build:
	docker compose -f docker-compose.prod.yml build

tag:
	docker tag projectbible-oldtest:latest docker.io/ck5150/oldtest:latest
	docker tag projectbible-newtest:latest docker.io/ck5150/newtest:latest

push:
	docker push docker.io/ck5150/oldtest:latest
	docker push docker.io/ck5150/newtest:latest

deploy: build tag push