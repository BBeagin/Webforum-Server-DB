# WEB FORUM PROJECT

An expressjs Web Server application that interfaces with a mysql database.

## Table of Contents

- [Getting Started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [Installation](#installation)
- [Usage](#usage)
-   [Running the application](#running)
-   [Stopping the application](#stopping)
-   [Accessing the web application](#access)
-   [Accessing and Administrating the database through phpmyadmin](#admin)

## Getting Started <a name="getting-started"></a>

These instructions will get you up and running with the project.

### Prerequisites <a name="prerequisites"></a>

- Docker: [Install Docker](https://docs.docker.com/get-docker/)

(Linux Only)
- Docker Compose: [Install Docker Compose](https://docs.docker.com/compose/install/)

### Installation <a name="installation"></a>

1. Clone the repository:

    In a terminal, navigate to the location you would like the root project folder to be created in and type one of the following commands:
    
    ```shell
    git clone https://github.com/BBeagin/Webforum-Server-DB.git
    ```
    or (if you have a key registered to github)
    ```shell
    git clone git@github.com:BBeagin/Webforum-Server-DB.git
    ```

2. Build and run the docker images:
    
    In the terminal, navigate to the root folder of the project and start the docker-compose project:

    ```shell
    cd Webforum-Server-DB
    docker-compose up
    ```
    
    The first time running this command may take some time to pull all of the neccessary dependencies. After everything has been pulled, three containers will be started: A mysql database, An expressjs webserver, and a phpmyadmin server.

## Usage <a name="usage"></a>

These instructions will help you run and stop the application.
    
### Running the application <a name="running"></a>

Just like during installation, you can run the project at any time, by navigating to the root directory of the project in a terminal and typing:

```shell
docker-compose up
```

### Stopping the application <a name="stopping"></a>

In order to gracefully stop the application (Deletes containers after stopping them), open a second terminal in the root project directory and type the following:

```shell
docker-compose down
```

### Accessing the web application <a name="access"></a>

With the containers running, open a web browser and navigate to http://localhost:8080

### Accessing and Administrating the database through phpmyadmin <a name="admin"></a>

With the containers running, open a web browser and navigate to http://localhost:8081

Login as 'root' with a blank password