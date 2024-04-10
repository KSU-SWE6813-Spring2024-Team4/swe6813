from ..graph_db import GraphDb
from ..helpers import db_helpers, request_helpers
from flask import (
    Blueprint, flash, g, redirect, request, session, url_for
)


prefix = '/friend'
bp = Blueprint('friend', __name__, url_prefix=prefix)


@bp.get('/list/<user_id>')
def list_friends(user_id):
    graph = GraphDb()
    db_conn = graph.get_database_driver()

    if not db_helpers.user_id_exists(db_conn, user_id):
        return 'Error: A user with the given id does not exist'

    friends_list_query = db_conn.run(
        """
        MATCH(friend: User)<-[:IS_FRIENDS_WITH]-(user: User { id: $user_id})
        RETURN friend
        """, {'user_id': user_id}).data()

    return friends_list_query


@bp.delete("/delete")
def delete_friend():
    user_id = request_helpers.get_user_id(request.headers)
    if user_id is None:
        return 'Error: User ID not found'

    if 'friend_user_id' not in request.form:
        return 'Error: Missing form field { friend_user_id }'

    graph = GraphDb()
    db_conn = graph.get_database_driver()

    friend_id = request.form['friend_user_id']

    if not db_helpers.user_id_exists(db_conn, user_id):
        return 'Error: A user with the given id does not exist'

    if not db_helpers.user_id_exists(db_conn, friend_id):
        return 'Error: A user with the given id does not exist'

    delete_query_one = db_conn.run(
        """
        MATCH(user: User { id: $user_id})-[rel: IS_FRIENDS_WITH]->(friend: User { id: $friend_id})
        DELETE rel
        RETURN user, rel, friend
        """, {'user_id': user_id, 'friend_id': friend_id}).data()

    # Just use the same query and switch the args to delete the complimentary relationship
    delete_query_two = db_conn.run(
        """
        MATCH(user: User { id: $user_id})-[rel: IS_FRIENDS_WITH]->(friend: User { id: $friend_id})
        DELETE rel
        RETURN user, rel, friend
        """, {'user_id': friend_id, 'friend_id': user_id}).data()

    return delete_query_one and delete_query_two