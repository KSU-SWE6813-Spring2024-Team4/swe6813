
from ..source.blueprints.user import prefix as user_prefix
from ..source.blueprints.friend_requests import prefix as friend_request_prefix
import uuid

from ..source.graph_db import GraphDb
user_endpoint = user_prefix
friend_request_endpoint = friend_request_prefix


def test_create_friend_request_succeeds(client, faker):
    user1_name = faker.name()
    user2_name = faker.name()

    user1_make = client.post(user_endpoint + '/add', data={
        'name': user1_name
    })

    user1_data = user1_make.get_json()
    assert user1_make.status_code == 200
    assert user1_name == user1_data['user']['name']

    user2_make = client.post(user_endpoint + '/add', data={
        'name': user2_name
    })

    user2_data = user2_make.get_json()
    assert user2_make.status_code == 200
    assert user2_name == user2_data['user']['name']

    from_user_id = user1_data['user']['id']
    to_user_id = user2_data['user']['id']

    friend_request_make = client.post(friend_request_endpoint + '/add', data={
        'from_user': from_user_id,
        'to_user': to_user_id
    })

    assert friend_request_make is not None
    assert friend_request_make.status_code == 200
    friend_request_make_data = friend_request_make.get_json()

    assert friend_request_make_data['friend_request']['from_user_id'] == from_user_id
    assert friend_request_make_data['friend_request']['to_user_id'] == to_user_id


def test_create_friend_request_no_from_uid(client):
    to_uid = str(uuid.uuid4())

    friend_request_make_response = client.post(friend_request_endpoint + '/add', data={
        'to_user': to_uid
    })

    assert friend_request_make_response.status_code == 200
    assert friend_request_make_response.get_data(as_text=True) == "Error: Missing form field { from_user }"

def test_create_friend_request_no_to_uid(client):
    from_uid = str(uuid.uuid4())

    friend_request_make_response = client.post(friend_request_endpoint + '/add', data={
        'from_user': from_uid
    })

    assert friend_request_make_response.status_code == 200
    assert friend_request_make_response.get_data(as_text=True) == "Error: Missing form field { to_user }"


def test_create_friend_request_invalid_from_uid(client):
    random_user_id_query = """
    MATCH(user: User) 
    WITH user, rand() as r 
    ORDER BY r RETURN user 
    LIMIT 1;
    """

    graph = GraphDb()
    db_conn = graph.get_database_driver()

    random_user_id_query_result = db_conn.run(random_user_id_query).data()

    random_user_id = random_user_id_query_result[0]['user']['id']

    friend_request_make_response = client.post(friend_request_endpoint + '/add', data={
        'from_user': str(uuid.uuid4()),
        'to_user': random_user_id
    })

    assert friend_request_make_response.status_code == 200
    assert friend_request_make_response.get_data(as_text=True) == "Error: A user with that id does not exist"


def test_create_friend_request_invalid_to_uid(client):
    random_user_id_query = """
    MATCH(user: User) 
    WITH user, rand() as r 
    ORDER BY r RETURN user 
    LIMIT 1;
    """

    graph = GraphDb()
    db_conn = graph.get_database_driver()

    random_user_id_query_result = db_conn.run(random_user_id_query).data()

    random_user_id = random_user_id_query_result[0]['user']['id']

    friend_request_make_response = client.post(friend_request_endpoint + '/add', data={
        'from_user': random_user_id,
        'to_user':  str(uuid.uuid4())
    })

    assert friend_request_make_response.status_code == 200
    assert friend_request_make_response.get_data(as_text=True) == "Error: A user with that id does not exist"
