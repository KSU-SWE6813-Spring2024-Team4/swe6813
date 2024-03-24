import React from 'react';

const initialState = {
    authUser : {
        id: '',
        username: '',
        games: [],
        attribute: '',
        skillLevel: '',
        signInToken: ''
    },
    gamesList : {
        games: []
    },
    singleGame : {
        id: '',
        name: '',
        description: ''
    },
    friends : {
        id: '',
        friends: []
    }
}
export function MainReducer(state = initialState, action) {
    switch(action.type) {
        case 'user/getUser':
            return state.authUser;
        case 'games/getGameList': 
            return state.gamesList;
        case 'games/setGameList':
            state.gameList = action.payload;
            break;
        case 'games/getGame':
            return state.singleGame;
        case 'games/setGame':
            state.singleGame = action.payload;
            break;
        case 'friend/getFriendsList': 
            return state.friends;
        case 'friend/setFriendList' :
            state.friends = action.payload;
            break;
        default:
            throw error('unknown action');   
    }
}