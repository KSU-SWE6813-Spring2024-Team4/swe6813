import pytest
from ..source import app as main_service_app

pytest_plugins = ['faker']


@pytest.fixture()
def app():
    app = main_service_app.create_app({
        "TESTING": True,
    })

    # other setup can go here
    yield app

    # clean up / reset resources here


@pytest.fixture()
def client(app):
    return app.test_client()


@pytest.fixture()
def runner(app):
    return app.test_cli_runner()


