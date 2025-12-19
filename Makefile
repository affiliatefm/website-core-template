.PHONY: install dev build preview check fmt lint bootstrap seed update clean

install:
	@npm install

dev:
	@npm run dev

build:
	@npm run build

preview:
	@npm run preview

check:
	@npm run check

fmt:
	@npx prettier --write .

bootstrap:
	@npm run bootstrap

seed:
	@npm run seed:demo

update:
	@npm run update:core

clean:
	@rm -rf dist .astro
