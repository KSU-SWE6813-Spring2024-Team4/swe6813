import React from 'react';

export function MainReducer(state, action) {
    switch(action.type) {
        case 'authUser':
            return { 
                id: '',
                username: '',
                games: [],
                attribute: '',
                skillLevel: '',
                signInToken: ''
            };
        case 'games': 
            return {
                games: []
            };
        case 'singleGame':
            return {
                id: '',
                name: '',
                description: ''
            };
        case 'friends': 
            return {
                id: '',
                friends: [] // based on friend's user ID
            };
        default:
            throw error('unknown action');   
    }
}