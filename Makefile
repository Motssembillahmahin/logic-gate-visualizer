.PHONY: dev build preview deploy lint test install

install:
	npm install

test:
	npm run test

dev:
	npm run dev

build:
	npm run build

preview:
	npm run preview

deploy:
	npm run build && npx gh-pages -d dist

lint:
	npm run lint
