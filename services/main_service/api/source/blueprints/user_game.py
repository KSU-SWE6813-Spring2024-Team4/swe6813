import functools
import json
from ..graph_db import GraphDb
from flask import (
    Blueprint, flash, g, redirect, request, session, url_for
)
import uuid

prefix='/user/game'
bp = Blueprint('user_game', __name__, url_prefix=prefix)


@bp.get('/list')
def list_user_games():
    graph = GraphDb()
    db_conn = graph.get_database_driver()
    user_game_list = db_conn.run(
        """
        MATCH (user: User{id: $id}) return user;
        """
    ).data()

    return user_game_list


@bp.get('/show/<user_id>')
def show_user_game(user_id):
    pass


@bp.post('/add')
def add_user_game():
    if 'uid' not in request.form:
        return "Error: Missing form field { uid }"

    if 'gid' not in request.form:
        return "Error: Missing form field { gid }"

    uid = request.form['uid']
    gid = request.form['gid']

    graph = GraphDb()
    db_conn = graph.get_database_driver()

    uid_exists = db_conn.run(
        """
        MATCH(user: User)
        WHERE user.id = $uid
        RETURN count(user) as usercount
        """, {'uid': uid}
    ).single().data()
    print(uid_exists)

    if uid_exists['usercount'] != 1:
        return "Error: A user with that id does not exist"

    gid_exists = db_conn.run(
        """
        MATCH(game: Game)
        WHERE game.id = $gid
        RETURN count(game) as gamecount
        """, {'gid': gid}
    ).single().data()

    if gid_exists['gamecount'] != 1:
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
        """, {'uid': uid, 'gid': gid}
    ).single()

    if user_game_inserted is None:
        return "ERROR: Game cannot be added at this time.\n"
    else:
        return user_game_inserted.data()


@bp.delete('/delete')
def delete_user_game():
    pass

@bp.put('/edit')
def edit_user_game():
    pass




