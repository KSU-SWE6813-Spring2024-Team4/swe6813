import functools
import json
from ..graph_db import GraphDb
from flask import (
    Blueprint, flash, g, redirect, request, session, url_for
)
import uuid

bp = Blueprint('games', __name__, url_prefix='/games')


@bp.get('/list/')
def list_games():
    return f'List games!'


@bp.get('/show/<game_id>')
def show_game(game_id):
    return f'Show single game with ID {game_id} !'


@bp.post('/add')
def add_game():
    name = request.form['name']
    desc = request.form['description']

    game = Game(name, desc)
    # serializing and loading the object gives us a pure JSON dict of the keys and values of the obj.
    loaded = json.loads(game.serialize())

    graph = GraphDb()
    db_conn = graph.get_database_driver()
    game_inserted = db_conn.run(
        """
        CREATE(game: Game { name: $name, description: $description, id: $id }) RETURN game
        """, loaded
    ).single()

    return game_inserted.data()


@bp.delete('/delete')
def delete_game():
    game_id = request.form['id']

    graph = GraphDb()
    db_conn = graph.get_database_driver()
    game_deleted = db_conn.run(
        """MATCH(game: Game {id: $id}) DETACH DELETE game"""
        , {'id': game_id}
    )

    return game_deleted.data()


@bp.put('/edit')
def edit_game():
    return f'Edit game!'


class Game():
    def __init__(self, name, description):
        self.name = name
        self.description = description
        self.id = str(uuid.uuid4())

    def serialize(self):
        return json.dumps(self.__dict__)

