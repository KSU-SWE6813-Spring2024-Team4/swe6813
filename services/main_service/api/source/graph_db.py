from neo4j import GraphDatabase, basic_auth
from dotenv import dotenv_values, load_dotenv, find_dotenv
import os


# Treat the graph database instance like a singleton and make sure we get a single reference to it.
# Then store it in the app
class GraphDb:
    def get_database_driver(g):
        load_dotenv(find_dotenv())
        db = GraphDatabase.driver(os.environ['DATABASE_URL'], auth=basic_auth(os.environ['DATABASE_USER'],
                                                                              str(os.environ['DATABASE_PASSWORD'])))

        if not hasattr(g, 'neo4j_db'):
            g.neo4j_db = db.session()
        return g.neo4j_db


