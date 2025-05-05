import {combineReducers} from 'redux';

import * as actionTypes from './actionTypes';

const initialState = {
    user: null,
    successMessage: null
};

const user = (state = initialState.user, action) => {

    switch (action.type) {

        case actionTypes.LOGIN_COMPLETED:
            return action.authenticatedUser.user;

        case actionTypes.LOGOUT:
            return initialState.user;

        case actionTypes.SIGN_UP_COMPLETED:
            return action.authenticatedUser.user;

        case actionTypes.UPDATE_PROFILE_COMPLETED:
            return action.user;

        default:
            return state;

    }

}

const successMessage = (state = initialState.successMessage, action) => {
    switch (action.type) {
        case actionTypes.SHOW_SUCCESS_MESSAGE:
            return action.payload;
        case actionTypes.HIDE_SUCCESS_MESSAGE:
            return null;
        default:
            return state;
    }
};

const reducer = combineReducers({
    user,
    successMessage
});

export default reducer;


