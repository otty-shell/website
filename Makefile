SHELL := /bin/bash
.ONESHELL:

NODE_VERSION ?= 22.12.0
NVM_DIR ?= $(HOME)/.nvm
OTTY_DOCUMENTATION_INDEX ?= $(abspath ../otty/docs/public/index.md)
OTTY_RELEASE_SOURCE ?= fixture

export NVM_DIR
export OTTY_DOCUMENTATION_INDEX
export OTTY_RELEASE_SOURCE

.PHONY: dev
dev:
	. "$(NVM_DIR)/nvm.sh"
	nvm use "$(NODE_VERSION)"
	npm run dev
