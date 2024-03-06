import uuid

from ..source.blueprints.user_game import prefix as user_game_prefix
from ..source.blueprints.user import prefix as user_prefix
from ..source.blueprints.games import prefix as game_prefix

from ..source.graph_db import GraphDb


def test_add_user_game(client):

    random_user_game_combo_query = """
    MATCH(user: User), (game: Game) 
    WHERE NOT (user)-[:OWNS_GAME]->(game) 
    WITH user, game, rand() as r 
    ORDER BY r RETURN user, game 
    LIMIT 1;
    """

    graph = GraphDb()
    db_conn = graph.get_database_driver()
    random_data = db_conn.run(random_user_game_combo_query).data()
    user_id = random_data[0]['user']['id']
    game_id = random_data[0]['game']['id']

    result = client.post(user_game_prefix + '/add', data={
        'uid': user_id,
        'gid': game_id
    })
    assert result.status_code == 200
    result_response = result.get_json()
    assert result_response['user']['id'] == user_id
    assert result_response['game']['id'] == game_id


def test_create_user_no_uid_error(client):
    result = client.post(user_game_prefix + '/add', data={
        'gid': str(uuid.uuid4())
    })
    assert result.status_code == 200
    assert result.get_data(as_text=True) == "Error: Missing form field { uid }"


def test_create_user_no_gid_error(client):
    result = client.post(user_game_prefix + '/add', data={
        'uid': str(uuid.uuid4())
    })
    assert result.status_code == 200
    assert result.get_data(as_text=True) == "Error: Missing form field { gid }"


