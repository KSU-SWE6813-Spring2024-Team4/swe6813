from ..graph_db import GraphDb
from  ..helpers import db_helpers, request_helpers
from flask import (
    Blueprint, flash, g, redirect, request, session, url_for
)

prefix='/user/game'
bp = Blueprint('user_game', __name__, url_prefix=prefix)


@bp.get('/list')
def list_user_games():
    user_id = request_helpers.get_user_id(request.headers)
    if user_id is None:
        return 'Error: User ID not found'

    graph = GraphDb()
    db_conn = graph.get_database_driver()

    if not db_helpers.user_id_exists(db_conn, user_id):
        return "Error: A user with that id does not exist"

    user_game_list = db_conn.run(
        """
        MATCH (user: User{id: $id}) return user;
        """
    , {'id': user_id}).data()

    return user_game_list


@bp.get('/show/<user_id>')
def show_user_game(user_id):

    graph = GraphDb()
    db_conn = graph.get_database_driver()

    if not db_helpers.user_id_exists(db_conn, user_id):
        return "Error: A user with that id does not exist"

    user_games = db_conn.run(
        """
        MATCH(user: User {id: $uid})-[:OWNS_GAME]->(game: Game)
        RETURN game
        """, {'uid': user_id}
    )

    return user_games.data()


@bp.post('/add')
def add_user_game():
    user_id = request_helpers.get_user_id(request.headers)
    if user_id is None:
        return 'Error: User ID not found'

    if 'gid' not in request.form:
        return "Error: Missing form field { gid }"

    gid = request.form['gid']

    graph = GraphDb()
    db_conn = graph.get_database_driver()

    uid_exists = db_helpers.user_id_exists(db_conn, user_id)

    if not uid_exists:
        return "Error: A user with that id does not exist"

    gid_exists = db_helpers.game_id_exists(db_conn, gid)

    if not gid_exists:
        return "Error: A game with that id does not exist"

    user_game_inserted = db_conn.run(
        """
        MATCH(user: User), (game: Game)
        WHERE (user).id = $uid
        AND (game).id = $gid
        AND NOT EXISTS {
            (user)-[:OWNS_GAME]->(game)
        } 
        CREATE (user)-[owns_game :OWNS_GAME]->(game)
        RETURN user, owns_game, game
        """, {'uid': user_id, 'gid': gid}
    ).single()

    if user_game_inserted is None:
        return "ERROR: Game cannot be added at this time.\n"
    else:
        return user_game_inserted.data()


@bp.delete('/delete')
def delete_user_game():
    user_id = request_helpers.get_user_id(request.headers)
    if user_id is None:
        return 'Error: User ID not found'

    if 'gid' not in request.form:
        return "Error: Missing form field { gid }"

    gid = request.form['gid']

    graph = GraphDb()
    db_conn = graph.get_database_driver()

    uid_exists = db_helpers.user_id_exists(db_conn, user_id)

    if not uid_exists:
        return "Error: A user with that id does not exist"

    gid_exists = db_helpers.game_id_exists(db_conn, gid)

    if not gid_exists:
        return "Error: A game with that id does not exist"

    user_game_deleted = db_conn.run(
        """
        MATCH(user: User {id: $uid})-[owns_game:OWNS_GAME]->(game: Game {id: $gid}) 
        DELETE owns_game
        RETURN user, owns_game, game
        """, {'uid': user_id, 'gid': gid}
    ).single()

    return user_game_deleted.data()


@bp.put('/edit')
def edit_user_game():
    pass




