import jwt
import os
import base64


def get_user_id(headers):

    bearer = headers.get('Authorization')
    if bearer is None:
        return None
    token = bearer.split()[1]
    key = base64.b64decode(os.environ['JWT_KEY'])
    decoded = jwt.decode(token, key, algorithms=['HS512'])
    if 'sub' not in decoded:
        return None
    return decoded['sub']


