.PHONY: build push clean run stop info test

REGISTRY_ENDPOINT ?= registry.cn-hangzhou.aliyuncs.com
REGISTRY_NAMESPACE ?= hatlonely
REPOSITORY=web-dev-box
REPOSITORY_DEV=$(REPOSITORY)-dev
VERSION=$(shell git describe --tags --always 2>/dev/null || echo "unknown")
HOST_PORT=4001

build:
	docker build -t $(REGISTRY_ENDPOINT)/$(REGISTRY_NAMESPACE)/$(REPOSITORY):$(VERSION) .

push: build
	docker push $(REGISTRY_ENDPOINT)/$(REGISTRY_NAMESPACE)/$(REPOSITORY):$(VERSION)

clean:
	docker rmi $(REGISTRY_ENDPOINT)/$(REGISTRY_NAMESPACE)/$(REPOSITORY):$(VERSION) || true

info:
	@echo "Image: $(REGISTRY_ENDPOINT)/$(REGISTRY_NAMESPACE)/$(REPOSITORY):$(VERSION)"
	@docker images | grep $(REGISTRY_ENDPOINT)/$(REGISTRY_NAMESPACE)/$(REPOSITORY) || true

run: build stop
	docker run -d --rm -p $(HOST_PORT):3000 --name $(REPOSITORY) $(REGISTRY_ENDPOINT)/$(REGISTRY_NAMESPACE)/$(REPOSITORY):$(VERSION)

stop:
	docker stop $(REPOSITORY) || true
	docker rm $(REPOSITORY) || true

test:
	curl -s --retry 10 --retry-delay 5 --retry-connrefused http://localhost:$(HOST_PORT) || exit 1

# 开发相关命令
dev:
	npm start

build-local:
	npm run build

# Docker Compose 相关命令
compose-up: build
	docker-compose up -d

compose-down:
	docker-compose down
