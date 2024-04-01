import json
from ..graph_db import GraphDb
from ..helpers import request_helpers
from flask import (
    Blueprint, flash, g, jsonify, redirect, request, session
)
import uuid
import os

prefix = "/games"
bp = Blueprint('games', __name__, url_prefix=prefix)


@bp.get('/list')
def list_games():
    graph = GraphDb()
    db_conn = graph.get_database_driver()
    game_list = db_conn.run(
        """
        MATCH (game: Game{}) return game;
        """
    ).data()

    return game_list


@bp.get('/show/<game_id>')
def show_game(game_id):
    graph = GraphDb()
    db_conn = graph.get_database_driver()
    game = db_conn.run(
        """
        MATCH (game: Game {id: $id}) return game;
        """, {'id': game_id}
    ).data()

    return game


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


@bp.get('/ping')
def ping():
    return 'ping!'


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
    id = request.form['id']
    name = request.form['name']
    description = request.form['description']

    graph = GraphDb()
    db_conn = graph.get_database_driver()

    game_updated = db_conn.run(
        """
        MATCH(game: Game{id: $id}) SET game.name = $name, game.description = $description
        RETURN game
        """, {'id': id, 'name': name, 'description': description}
    ).data()

    return game_updated


class Game():
    def __init__(self, name, description):
        self.name = name
        self.description = description
        self.id = str(uuid.uuid4())

    def serialize(self):
        return json.dumps(self.__dict__)

