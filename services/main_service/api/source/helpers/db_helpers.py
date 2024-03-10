

def user_id_exists(db_conn, user_id):
    uid_exists = db_conn.run(
        """
        MATCH(user: User)
        WHERE user.id = $uid
        RETURN count(user) as usercount
        """, {'uid': user_id}
    ).single().data()

    return uid_exists['usercount'] == 1


def game_id_exists(db_conn, game_id):
    gid_exists = db_conn.run(
        """
        MATCH(game: Game)
        WHERE game.id = $gid
        RETURN count(game) as gamecount
        """, {'gid': game_id}
    ).single().data()

    return gid_exists['gamecount'] == 1

