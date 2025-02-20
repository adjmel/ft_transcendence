all: up

up:
		@docker compose -f docker-compose.yml up -d --build

down:
		@docker compose -f docker-compose.yml down

clean: down
		rm -rf srcs/user_profile/user_profile/media/*

.PHONY: all up down clean