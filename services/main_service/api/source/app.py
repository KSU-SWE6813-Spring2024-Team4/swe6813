
import os
from flask import Flask, g
from . import graph_db


def create_app(test_config=None):
    # create and configure the app
    app = Flask(__name__, instance_relative_config=True)

    # app.config.from_mapping(
    #     SECRET_KEY='dev',
    #     DATABASE=os.path.join(app.instance_path, 'api.neo4j'),
    # )
    with app.app_context():
        graph = graph_db.GraphDb()
        graph.get_database_driver()

    from .blueprints import games, user, user_game, friend_requests, friends, user_follow, user_rating
    app.register_blueprint(games.bp)
    app.register_blueprint(user.bp)
    app.register_blueprint(user_game.bp)
    app.register_blueprint(friend_requests.bp)
    app.register_blueprint(friends.bp)
    app.register_blueprint(user_follow.bp)
    app.register_blueprint(user_rating.bp)

    if test_config is None:
        # load the instance config, if it exists, when not testing
        app.config.from_pyfile('config.py', silent=True)
    else:
        # load the test config if passed in
        app.config.from_mapping(test_config)

    # ensure the instance folder exists
    try:
        os.makedirs(app.instance_path)
    except OSError:
        pass

    return app
