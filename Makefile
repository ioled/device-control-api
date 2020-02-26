VERSION := $$(cat package.json | grep version | sed 's/"/ /g' | awk {'print $$3'})
MONGO_URI:= $$(cat env.json | grep MONGO_URI | sed 's/"/ /g' | awk {'print $$3'})
cloudRegion := $$(cat env.json | grep cloudRegion | sed 's/"/ /g' | awk {'print $$3'})
projectId := $$(cat env.json | grep projectId | sed 's/"/ /g' | awk {'print $$3'})
registryId := $$(cat env.json | grep registryId | sed 's/"/ /g' | awk {'print $$3'})
REGISTRY=gcr.io
SVC=ioled/device-control-api
PORT=5010

version v:
	@echo $(VERSION)

init i:
	@echo "[Dependencies] Installing dependencies"
	@npm install

docker:
	@echo [Docker] Building docker image
	@docker build -t $(REGISTRY)/$(projectId)/$(SVC):$(VERSION) .

docker-compose co:
	@echo [Docker][Compose] Running with docker compose
	@docker-compose build
	@docker-compose up

docker-registry reg:
	@echo [Docker][Registry] Deploying to registry
	@make docker
	@docker push $(REGISTRY)/$(projectId)/$(SVC):$(VERSION)

deploy d:
	@echo "[Cloud Function Deployment] Deploying Function"
	@gcloud functions deploy deviceControlApi --set-env-vars MONGO_URI=$(MONGO_URI) --set-env-vars cloudRegion=$(cloudRegion) --set-env-vars projectId=$(projectId) --set-env-vars registryId=$(registryId) --runtime nodejs8 --trigger-http --entry-point deviceControlApi

deploy-test dt:
	@echo "[TESTING] [Cloud Function Deployment] Deploying Function"
	@gcloud functions deploy TestdeviceControlApi --set-env-vars MONGO_URI=$(MONGO_URI) --set-env-vars cloudRegion=$(cloudRegion) --set-env-vars projectId=$(projectId) --set-env-vars registryId=$(registryId) --runtime nodejs8 --trigger-http --entry-point deviceControlApi

run r:
	@echo "[Running] Running service"
	@PORT=$(PORT) MONGO_URI=$(MONGO_URI) cloudRegion=$(cloudRegion) projectId=$(projectId) registryId=$(registryId) node src/start.js

.PHONY: version v init i deploy d run r