# Auth Service

### Things to install:
[Java](https://aws.amazon.com/corretto/) 
(Feel free to use any distribution, this links to Corretto)

[MySQL](https://dev.mysql.com/downloads/mysql/)

[MySQL Workbench](https://www.mysql.com/products/workbench/)

### Setting up the database:
````
CREATE DATABASE IF NOT EXISTS `swe6813_auth`;
CREATE USER 'swe6813'@'%' IDENTIFIED BY 'swe6813';
GRANT ALL PRIVILEGES ON * . * TO 'swe6813'@'%';
````

### Running the service locally

Mac / Linux:
`./mvnw spring-boot:run`

Windows:
`./mvnw.cmd spring-boot:run`