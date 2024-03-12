from ..graph_db import GraphDb
from  ..helpers import db_helpers
from flask import (
    Blueprint, flash, g, redirect, request, session, url_for
)
import uuid
import json


prefix = '/friend/request'
bp = Blueprint('friend_requests', __name__, url_prefix=prefix)


@bp.post('/add')
def add_friend_request():
    if 'from_user' not in request.form:
        return "Error: Missing form field { from_user }"

    if 'to_user' not in request.form:
        return "Error: Missing form field { to_user }"

    from_user_id = request.form['from_user']
    to_user_id = request.form['to_user']

    graph = GraphDb()
    db_conn = graph.get_database_driver()

    from_uid_exists = db_helpers.user_id_exists(db_conn, from_user_id)

    if not from_uid_exists:
        return "Error: A user with that id does not exist"

    to_uid_exists = db_helpers.user_id_exists(db_conn, to_user_id)

    if not to_uid_exists:
        return "Error: A user with that id does not exist"

    friend_request = FriendRequest(from_user_id, to_user_id)

    friend_request_created = db_conn.run(
        """
        CREATE(friend_request: FriendRequest { from_user_id: $from_uid, to_user_id: $to_uid, id: $id })
        RETURN friend_request
        """, json.loads(friend_request.serialize())
    ).single()

    if friend_request_created is None:
        return "ERROR: Friend request cannot be created at this time.\n"
    else:
        return friend_request_created.data()


@bp.get('/list/<user_id>')
def get_friend_requests(user_id):

    graph = GraphDb()
    db_conn = graph.get_database_driver()
    friend_request_query_res = db_conn.run("""
    MATCH(fr: FriendRequest) WHERE fr.from_user_id = $user_id OR fr.to_user_id = $user_id
    RETURN fr
    """, {'user_id': user_id}).data()

    return friend_request_query_res


@bp.get('/show/<fr_id>')
def get_friend_request(fr_id):

    graph = GraphDb()
    db_conn = graph.get_database_driver()
    friend_request_query_res = db_conn.run("""
    MATCH(fr: FriendRequest { id:  $fr_id })
    RETURN fr
    """, {'fr_id': fr_id}).single().data()

    return friend_request_query_res


@bp.delete('/delete')
def delete_friend_request():

    if 'fr_id' not in request.form:
        return "Error: Missing form field { fr_id }"

    fr_id = request.form['fr_id']
    graph = GraphDb()
    db_conn = graph.get_database_driver()
    friend_request_query_res = db_conn.run("""
    MATCH(fr: FriendRequest { id:  $fr_id})
    DELETE fr
    RETURN fr
    """, {'fr_id': fr_id}).data()

    return friend_request_query_res


class FriendRequest:
    def __init__(self, from_uid, to_uid):
        self.from_uid = from_uid
        self.to_uid = to_uid
        self.id = str(uuid.uuid4())

    def serialize(self):
        return json.dumps(self.__dict__)

