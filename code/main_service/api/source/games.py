import functools

from flask import (
    Blueprint, flash, g, redirect, request, session, url_for
)

bp = Blueprint('games', __name__, url_prefix='/games')


@bp.get('/list/')
def list_games():
    return f'List games!'


@bp.get('/show/<game_id>')
def show_game(game_id):
    return f'Show single game with ID {game_id} !'


@bp.post('/add')
def add_game():
    return f'Add a game!'


@bp.delete('/delete')
def delete_game():
    return f'Delete game!'


@bp.put('/edit')
def edit_game():
    return f'Edit game!'

