

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


def attr_id_exists(db_conn, attr_id):
    attr_exists = db_conn.run(
        """
        MATCH(attr: Attribute)
        WHERE attr.id = $attr_id
        RETURN count(attr) as attrcount
        """, {'attr_id': attr_id}
    ).single().data()

    return attr_exists['attrcount'] == 1


def skill_id_exists(db_conn, skill_id):
    skill_exists = db_conn.run(
        """
        MATCH(skill: Skill)
        WHERE skill.id = $skill_id
        RETURN count(skill) as skillcount
        """, {'skill_id': skill_id}
    ).single().data()

    return skill_exists['skillcount'] == 1


def rating_id_exists(db_conn, rating_id):
    rating_exists = db_conn.run(
        """
        MATCH(rating: Rating)
        WHERE rating.id = $rating_id
        RETURN count(rating) as ratingcount
        """, {'rating_id': rating_id}
    ).single().data()

    return rating_exists['ratingcount'] == 1

