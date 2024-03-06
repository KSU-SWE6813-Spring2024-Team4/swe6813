# Main Service

This service provides the "meat and potatoes" of the application and may be split into smaller components if time allows and size necessitates. 

# API

The API is a [Flask](https://flask.palletsprojects.com/en/3.0.x/) application providing endpoints for the following apis:
* games
* friends
* matchmaking

To run the api locally, create your python Virtual Env using `python3 -m venv venv`. Execute it using the OS-appropriate method, something like `. venv/bin/activate`


Now, run `pip install Flask` to install the dependencies. You should be able to run the development server using `flask --app main run --debug` to run the development server on `http://127.0.0.1:5000`. 

To exit the virtual environment, simply run `deactivate`. 

# Database

The database for this service is a [Neo4J graph database](https://neo4j.com/). Graph databases are a popular way of spanning large sets of data without having to do massive table joins, and we felt it an apt use for this project. 

