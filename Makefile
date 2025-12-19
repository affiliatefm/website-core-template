# Website Core Template
# =====================
# make         — show commands
# make dev     — start dev server
# make build   — build for production
# make update  — update core from upstream

.PHONY: help dev build preview clean install update

.DEFAULT_GOAL := help

# ─────────────────────────────────────────────────────────────────────────────

help:
	@echo ""
	@echo "\033[1mWebsite Core Template\033[0m"
	@echo ""
	@echo "  \033[32mmake dev\033[0m      Start dev server (localhost:4321)"
	@echo "  \033[32mmake build\033[0m    Build for production"
	@echo "  \033[32mmake preview\033[0m  Preview production build"
	@echo "  \033[32mmake update\033[0m   Update core from upstream"
	@echo "  \033[32mmake clean\033[0m    Remove build artifacts"
	@echo ""

# ─────────────────────────────────────────────────────────────────────────────

dev: node_modules
	@npm run dev

build: node_modules
	@npm run build

preview: node_modules
	@npm run preview

clean:
	@rm -rf dist node_modules .astro
	@echo "Clean."

install:
	@npm install

node_modules:
	@npm install

# ─────────────────────────────────────────────────────────────────────────────

update:
	@./scripts/update-core.sh

update-check:
	@./scripts/update-core.sh --dry-run
