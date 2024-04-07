import json
from ..graph_db import GraphDb
from flask import (
    Blueprint, flash, g, redirect, request, session, url_for
)
import uuid


prefix = "/skills"
bp = Blueprint('skills', __name__, url_prefix=prefix)


@bp.get('/list')
def list_skills():
    graph = GraphDb()
    db_conn = graph.get_database_driver()

    skills_query = db_conn.run(
        """
        MATCH(skill: Skill)
        RETURN skill
        """
    ).data()

    return skills_query


@bp.post('/add')
def add_skills():
    if 'name' not in request.form:
        return 'Error: Missing form field { name }'

    if 'description' not in request.form:
        description = ''
    else:
        description = request.form['description']

    skill = Skill(str(uuid.uuid4()), request.form['name'], description)

    graph = GraphDb()
    db_conn = graph.get_database_driver()

    loaded = json.loads(skill.serialize())

    skill_inserted = db_conn.run(
        """
        CREATE(skill: Skill { name: $name, id: $id, description: $description })
        RETURN skill
        """, loaded
    ).single()

    return skill_inserted


@bp.put('/edit')
def edit_skill():
    if 'skill_id' not in request.form:
        return 'Error: Missing form field { skill_id }'

    skill_id = request.form['skill_id']
    name = request.form['skill_name']
    description = request.form['skill_description']

    graph = GraphDb()
    db_conn = graph.get_database_driver()

    skill_updated = db_conn.run(
        """
        MATCH(attr: skill{id: $id}) SET attr.name = $name, attr.description = $description
        RETURN attr
        """, {'id': skill_id, 'name': name, 'description': description}
    ).data()

    return skill_updated


@bp.delete('/delete')
def delete_skill():
    if 'skill_id' not in request.form:
        return 'Error: Missing form field { skill_id }'

    graph = GraphDb()
    db_conn = graph.get_database_driver()

    skill_deleted = db_conn.run(
        """
        MATCH(skill: Skill{id: $id})
        DELETE skill
        RETURN skill
        """, {'id': request.form['skill_id']}
    ).data()

    return skill_deleted


class Skill:
    def __init__(self, id, name, description):
        self.id = id
        self.name = name
        self.description = description

    def serialize(self):
        return json.dumps(self.__dict__)

