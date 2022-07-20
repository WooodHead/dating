
### Installation:

1. Make a copy of the .env.dist for docker

    ```bash
    cp .env.dist .env
    ```
    ...and configure database connection:
    ```bash
    DOCKER_DATABASE=db_name
    DOCKER_USERNAME=db_user
    DOCKER_PASSWORD=db_password
    ```
 
3. Create and start all containers 
    ```bash
    make up
    ```
