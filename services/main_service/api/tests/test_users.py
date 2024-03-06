
endpoint = '/user/'


def test_create_user_success(client, faker):
    name = faker.name()
    result = client.post(endpoint + 'add', data={
        'name': name
    })
    assert result.status_code == 200
    result_response = result.get_json()
    assert result_response['user']['name'] == name


def test_create_user_no_name_error(client):
    result = client.post(endpoint + 'add', data={

    })
    assert result.status_code == 200
    assert result.get_data(as_text=True) == "Error: Missing form field { name }"


