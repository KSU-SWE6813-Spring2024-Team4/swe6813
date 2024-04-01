from ..graph_db import GraphDb
from ..helpers import db_helpers, request_helpers
from flask import (
    Blueprint, flash, g, redirect, request, session, url_for
)


prefix = '/user/follow'
bp = Blueprint('user_follow', __name__, url_prefix=prefix)


@bp.post('/add')
def follow_user():

    if 'follow_user_id' not in request.form:
        return 'Error: Missing form field { follow_user_id }'

    graph = GraphDb()
    db_conn = graph.get_database_driver()

    user_id = request_helpers.get_user_id(request.headers)
    follow_id = request.form['follow_user_id']

    if not db_helpers.user_id_exists(db_conn, follow_id):
        return 'Error: A user with the given id does not exist'

    follow_user_added = db_conn.run(
        """
        MATCH(user: User), (target: User)
        WHERE (user).id = $uid
        AND (target).id = $follow_id
        AND NOT EXISTS {
            (user)-[:FOLLOWS_USER]->(target)
        } 
        CREATE (user)-[follows_user: FOLLOWS_USER]->(target)
        RETURN user, follows_user, target
        """, {'uid': user_id, 'gid': follow_id}
    ).single()

    return follow_user_added


@bp.get('/show/')
def show_users_following():
    graph = GraphDb()
    db_conn = graph.get_database_driver()

    user_id = request_helpers.get_user_id(request.headers)

    if not db_helpers.user_id_exists(db_conn, user_id):
        return 'Error: A user with the given id does not exist'

    following_users_query = db_conn.run(
        """
        MATCH(user: User)-[:FOLLOWS_USER]->(me: User {user_id: $user_id})
        RETURN user
        """, {'user_id': user_id})

    return following_users_query.data()


@bp.get('/list/')
def list_users_followed():
    graph = GraphDb()
    db_conn = graph.get_database_driver()

    user_id = request_helpers.get_user_id(request.headers)

    if not db_helpers.user_id_exists(db_conn, user_id):
        return 'Error: A user with the given id does not exist'

    users_followed_query = db_conn.run(
        """
        MATCH(user: User {user_id: $user_id})-[:FOLLOWS_USER]->(target: User)
        RETURN target
        """, {'user_id': user_id}).data()

    return users_followed_query


@bp.delete("/delete")
def delete_followed_user():

    if 'follow_user_id' not in request.form:
        return 'Error: Missing form field { follow_user_id }'

    graph = GraphDb()
    db_conn = graph.get_database_driver()

    user_id = request_helpers.get_user_id(request.headers)
    friend_id = request.form['follow_user_id']

    if not db_helpers.user_id_exists(db_conn, friend_id):
        return 'Error: A user with the given id does not exist'

    delete_query_one = db_conn.run(
        """
        MATCH(user: User { id: $user_id})-[rel: FOLLOWS_USER]->(friend: User { id: $friend_id})
        DELETE rel
        RETURN user, rel, friend
        """, {'user_id': user_id, 'friend_id': friend_id}).data()

    return delete_query_one

