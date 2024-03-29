from ..graph_db import GraphDb
from ..helpers import db_helpers, request_helpers
from flask import (
    Blueprint, flash, g, redirect, request, session, url_for
)


prefix = '/user/rating'
bp = Blueprint('user_rating', __name__, url_prefix=prefix)


def create_rating(db_conn, user_id, rate_user_id, game_id, attr_id, skill_id):
    rating = Rating(user_id, rate_user_id, game_id, attr_id, skill_id)

    loaded = json.loads(rating.serialize())

    rating_inserted = db_conn.run(
        """
        MATCH(user: User {id: $from_user_id }), (target: User {id: $to_user_id}), (game: Game {id: $game_id}), 
        (attr: Attribute { id: $attribute_id}), (skill: Skill {id: $skill_id})
        CREATE(rating: Rating { id: $id, from_user_id: $from_user_id, to_user_id: $to_user_id, game_id: $game_id, attribute_id: $attribute_id, skill_id: $skill_id }),
        (user)-[:HAS_GIVEN_RATING]->(rating),(rating)-[:HAS_GOTTEN_RATING]->(target),
        (rating)-[:FOR_GAME]->(game),(rating)-[:HAS_ATTR]->(attr),(rating)-[:HAS_SKILL]->(skill)
        RETURN rating
        """, loaded
    ).single()

    return rating_inserted


@bp.get('/add')
def add_user_rating():

    if 'rate_user_id' not in request.form:
        return 'Error: Missing form field { rate_user_id }'

    if 'attribute_id' not in request.form:
        return 'Error: Missing form field { attribute_id }'

    if 'skill_id' not in request.form:
        return 'Error: Missing form field { skill_id }'

    if 'game_id' not in request.form:
        return 'Error: Missing form field { game_id }'

    graph = GraphDb()
    db_conn = graph.get_database_driver()

    user_id = request_helpers.get_user_id(request.headers)
    if not db_helpers.user_id_exists(db_conn, user_id):
        return 'Error: A user with the given id does not exist'

    rate_user_id = request.form['rate_user_id']
    if not db_helpers.user_id_exists(db_conn, rate_user_id):
        return 'Error: A user with the given id does not exist'

    game_id = request.form['game_id']
    if not db_helpers.game_id_exists(db_conn, game_id):
        return 'Error: A game with the given id does not exist'

    attr_id = request.form['attribute_id']
    if not db_helpers.attr_id_exists(db_conn, attr_id):
        return 'Error: An attribute with the given id does not exist'

    skill_id = request.form['skill_id']
    if not db_helpers.skill_id_exists(db_conn, skill_id):
        return 'Error: A skill with the given id does not exist'

    return create_rating(db_conn, user_id, rate_user_id, game_id, attr_id, skill_id)


@bp.get('/list/')
def list_users_ratings_given():
    graph = GraphDb()
    db_conn = graph.get_database_driver()

    user_id = request_helpers.get_user_id(request.headers)

    if not db_helpers.user_id_exists(db_conn, user_id):
        return 'Error: A user with the given id does not exist'

    given_user_ratings = db_conn.run(
        """
        MATCH(rating: Rating)<-[:HAS_GIVEN_RATING]-(user: User {id: $user_id}), (attr: Attribute)<-[:HAS_ATTR]-(rating),
        (skill: Skill)<-[:HAS_SKILL]-(rating), (game: Game)<-[:FOR_GAME]-(rating), (rating_for: User)<-[:HAS_GOTTEN_RATING]-(rating)
        RETURN rating_for, game, attr, skill
        """, {'user_id': user_id}
    )

    return given_user_ratings.data()


@bp.get('/show/')
def list_users_followed():
    graph = GraphDb()
    db_conn = graph.get_database_driver()

    user_id = request_helpers.get_user_id(request.headers)

    if not db_helpers.user_id_exists(db_conn, user_id):
        return 'Error: A user with the given id does not exist'

    given_user_ratings = db_conn.run(
        """
        MATCH(rating: Rating)<-[:HAS_GOTTEN_RATING]-(user: User {id: $user_id}), (attr: Attribute)<-[:HAS_ATTR]-(rating),
        (skill: Skill)<-[:HAS_SKILL]-(rating), (game: Game)<-[:FOR_GAME]-(rating), (rating_from: User)<-[:HAS_GIVEN_RATING]-(rating)
        RETURN rating_from, game, attr, skill
        """, {'user_id': user_id}
    )

    return given_user_ratings.data()


def delete_rating(db_conn, rating_id):
    attr_deleted = db_conn.run(
        """
        MATCH
        (rating: Rating{id: $id})-[given_rel:HAS_GIVEN_RATING]->(:User),
        (rating)-[gotten_rel:HAS_GOTTEN_RATING]->(:User),
        (rating)-[game_rel: FOR_GAME]->(:Game), 
        (rating)-[attr_rel: HAS_ATTR]->(:Attribute), 
        (rating)-[skill_rel:WITH_SKILL]->(:Skill)
        DELETE given_rel, gotten_rel, game_rel, attr_rel, skill_rel, rating
        RETURN rating
        """, {'id': rating_id}
    ).data()

    return attr_deleted


@bp.get('/list')
def list_ratings():
    graph = GraphDb()
    db_conn = graph.get_database_driver()

    ratings_query = db_conn.run(
        """
        MATCH(r: Rating)
        RETURN r
        """
    ).data()

    return ratings_query


@bp.post('/add')
def add_ratings():
    if 'game_id' not in request.form:
        return 'Error: Missing form field { game_id }'

    if 'attribute_id' not in request.form:
        return 'Error: Missing form field { attribute_id }'

    if 'skill_id' not in request.form:
        return 'Error: Missing form field { skill_id }'

    graph = GraphDb()
    db_conn = graph.get_database_driver()

    game_id = request.form['game_id']
    if not db_helpers.game_id_exists(db_conn, game_id):
        return 'Error: A game with the given id does not exist'

    attr_id = request.form['attribute_id']
    if not db_helpers.attr_id_exists(db_conn, attr_id):
        return 'Error: An attribute with the given id does not exist'

    skill_id = request.form['skill_id']
    if not db_helpers.skill_id_exists(db_conn, skill_id):
        return 'Error: A skill with the given id does not exist'

    return create_rating(db_conn, game_id, attr_id, skill_id)


@bp.put('/edit')
def edit_rating():
    if 'rating_id' not in request.form:
        return 'Error: Missing form field { rating_id }'

    graph = GraphDb()
    db_conn = graph.get_database_driver()

    rating_id = request.form['rating_id']
    if not db_helpers.rating_id_exists(db_conn, rating_id):
        return 'Error: A rating with the given id does not exist'

    game_id = request.form['game_id']
    if not db_helpers.game_id_exists(db_conn, game_id):
        return 'Error: A game with the given id does not exist'

    attr_id = request.form['attribute_id']
    if not db_helpers.attr_id_exists(db_conn, attr_id):
        return 'Error: An attribute with the given id does not exist'

    skill_id = request.form['skill_id']
    if not db_helpers.skill_id_exists(db_conn, skill_id):
        return 'Error: A skill with the given id does not exist'

    rating = db_conn.run(
        """
        MATCH(rating: Rating {id: $id})
        RETURN rating
        """, {'id': rating_id}
    ).single()

    user_id = rating['from_user_id']
    rate_user_id = rating['to_user_id']

    # Just delete the existing rating and recreate it. id don't matter.
    delete_rating(db_conn, rating_id)
    rating_created = create_rating(db_conn, user_id, rate_user_id,  game_id, attr_id, skill_id)
    return rating_created


@bp.delete('/delete')
def delete_rating():
    if 'rating_id' not in request.form:
        return 'Error: Missing form field { rating_id }'

    graph = GraphDb()
    db_conn = graph.get_database_driver()

    return delete_rating(db_conn, request.form['rating_id'])


class Rating:
    def __init__(self, from_user_id, to_user_id, game_id, attribute_id, skill_id):
        self.id = str(uuid.uuid4())
        self.from_user_id = from_user_id
        self.to_user_id = to_user_id
        self.game_id = game_id
        self.attribute_id = attribute_id
        self.skill_id = skill_id

    def serialize(self):
        return json.dumps(self.__dict__)


