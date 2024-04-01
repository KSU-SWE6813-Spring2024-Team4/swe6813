import json
from ..graph_db import GraphDb
from flask import (
    Blueprint, flash, g, redirect, request
)

prefix = '/user'
bp = Blueprint('user', __name__, url_prefix=prefix)


@bp.get('/list')
def list_users():
    graph = GraphDb()
    db_conn = graph.get_database_driver()
    user_list = db_conn.run(
        """
        MATCH (user: User{}) return user;
        """
    ).data()

    return user_list


@bp.get('/show/<user_id>')
def show_user(user_id):
    graph = GraphDb()
    db_conn = graph.get_database_driver()
    user = db_conn.run(
        """
        MATCH (user: User {id: $id}) return user;
        """, {'id': user_id}
    ).data()

    return user


@bp.post('/add')
def add_user():
    if not 'id' in request.form:
        return "Error: Missing form field { id }"

    if not 'name' in request.form:
        return "Error: Missing form field { name }"
    
    id = request.form['id']
    name = request.form['name']

    user = User(id, name)
    # serializing and loading the object gives us a pure JSON dict of the keys and values of the obj.
    loaded = json.loads(user.serialize())

    graph = GraphDb()
    db_conn = graph.get_database_driver()

    user_inserted = db_conn.run(
        """
        CREATE(user: User { name: $name, id: $id })
        RETURN user
        """, loaded
    ).single()

    return user_inserted.data()


@bp.delete('/delete')
def delete_user():
    user_id = request.form['id']

    graph = GraphDb()
    db_conn = graph.get_database_driver()
    user_deleted = db_conn.run(
        """MATCH(user: user {id: $id}) DETACH DELETE user"""
        , {'id': user_id}
    )

    return user_deleted.data()


@bp.put('/edit')
def edit_user():
    id = request.form['id']
    name = request.form['name']

    graph = GraphDb()
    db_conn = graph.get_database_driver()

    user_updated = db_conn.run(
        """
        MATCH(user: User{id: $id}) SET user.name = $name
        RETURN user
        """, {'id': id, 'name': name}
    ).data()

    return user_updated


class User:
    def __init__(self, id, name):
        self.name = name
        self.id = id

    def serialize(self):
        return json.dumps(self.__dict__)

