NAME=414022407633.dkr.ecr.us-east-1.amazonaws.com/nest-api-template
VERSION=1.0.0

build:
	docker build -t $(NAME):$(VERSION) . 
	docker system prune --force

auth:
	aws ecr get-login-password --region us-east-1 --profile fermelli-admin | docker login --username AWS --password-stdin 414022407633.dkr.ecr.us-east-1.amazonaws.com

push:
	docker push $(NAME):$(VERSION)