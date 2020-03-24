VERSION := $$(cat package.json | grep version | sed 's/"/ /g' | awk {'print $$3'})
cloudRegion := $$(cat env.json | grep cloudRegion | sed 's/"/ /g' | awk {'print $$3'})
PROJECT_ID := $$(cat env.json | grep PROJECT_ID | sed 's/"/ /g' | awk {'print $$3'})
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
	@docker build -t $(REGISTRY)/$(PROJECT_ID)/$(SVC):$(VERSION) .

docker-compose co:
	@echo [Docker][Compose] Running with docker compose
	@docker-compose build
	@docker-compose up

docker-registry reg:
	@echo [Docker][Registry] Deploying to registry
	@make docker
	@docker push $(REGISTRY)/$(PROJECT_ID)/$(SVC):$(VERSION)

deploy d:
	@echo "[Cloud Function Deployment] Deploying Function"
	@gcloud functions deploy deviceControlApi --set-env-vars cloudRegion=$(cloudRegion) --set-env-vars projectId=$(projectId) --set-env-vars registryId=$(registryId) --runtime nodejs8 --trigger-http --entry-point deviceControlApi

deploy-test dt:
	@echo "[TESTING] [Cloud Function Deployment] Deploying Function"
	@gcloud functions deploy TestdeviceControlApi --set-env-vars cloudRegion=$(cloudRegion) --set-env-vars projectId=$(projectId) --set-env-vars registryId=$(registryId) --runtime nodejs8 --trigger-http --entry-point deviceControlApi

run r:
	@echo "[Running] Running service"
	@PORT=$(PORT) GOOGLE_APPLICATION_CREDENTIALS="./google-cloud-service-account.json" cloudRegion=$(cloudRegion) PROJECT_ID=$(PROJECT_ID) registryId=$(registryId) node src/start.js

.PHONY: version v init i deploy d run r