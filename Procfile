web: yarn run install
web: yarn run docker:all up
web: docker exec -it ftf_user yarn run typeorm migration:show
web: docker exec -it ftf_user yarn run typeorm migration:run
web: yarn run start:dev