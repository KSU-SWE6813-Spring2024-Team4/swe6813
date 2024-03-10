from neo4j import GraphDatabase

driver = GraphDatabase.driver("bolt://52.72.13.205:47929", auth=basic_auth("neo4j", "knock-cape-reserve"))