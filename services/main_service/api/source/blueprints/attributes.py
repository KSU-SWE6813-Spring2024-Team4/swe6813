import json
from ..graph_db import GraphDb
from flask import (
    Blueprint, flash, g, redirect, request, session, url_for
)
import uuid


prefix = "/attributes"
bp = Blueprint('attributes', __name__, url_prefix=prefix)


@bp.get('/list')
def list_attributes():
    graph = GraphDb()
    db_conn = graph.get_database_driver()

    attributes_query = db_conn.run(
        """
        MATCH(attr: Attribute)
        RETURN attr
        """
    ).data()

    return attributes_query


@bp.post('/add')
def add_attributes():
    if 'name' not in request.form:
        return 'Error: Missing form field { name }'

    if 'description' not in request.form:
        description = ''
    else:
        description = request.form['description']

    attribute = Attribute(str(uuid.uuid4()), request.form['name'], description)

    graph = GraphDb()
    db_conn = graph.get_database_driver()

    loaded = json.loads(attribute.serialize())

    attribute_inserted = db_conn.run(
        """
        CREATE(attr: Attribute { name: $name, id: $id, description: $description })
        RETURN attr
        """, loaded
    ).single()

    return attribute_inserted


@bp.put('/edit')
def edit_attribute():
    if 'attribute_id' not in request.form:
        return 'Error: Missing form field { attribute_id }'

    attribute_id = request.form['attribute_id']
    name = request.form['attribute_name']
    description = request.form['attribute_description']

    graph = GraphDb()
    db_conn = graph.get_database_driver()

    attr_updated = db_conn.run(
        """
        MATCH(attr: Attribute{id: $id}) SET attr.name = $name, attr.description = $description
        RETURN attr
        """, {'id': attribute_id, 'name': name, 'description': description}
    ).data()

    return attr_updated


@bp.delete('/delete')
def delete_attribute():
    if 'attribute_id' not in request.form:
        return 'Error: Missing form field { attribute_id }'

    graph = GraphDb()
    db_conn = graph.get_database_driver()

    attr_deleted = db_conn.run(
        """
        MATCH(attr: Attribute{id: $id})
        DELETE attr
        RETURN attr
        """, {'id': request.form['attribute_id']}
    ).data()

    return attr_deleted


class Attribute:
    def __init__(self, id, name, description):
        self.id = id
        self.name = name
        self.description = description

    def serialize(self):
        return json.dumps(self.__dict__)

