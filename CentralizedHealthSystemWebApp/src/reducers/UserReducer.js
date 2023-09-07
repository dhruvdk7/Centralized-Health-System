import { STORE_USERDETAILS, REMOVE_USERDETAILS } from '../action/UserAction';

const initialUserState = {
    oUser: null
};

export const UserReducer = (state = initialUserState, action) => {
    switch (action.type) {
        case STORE_USERDETAILS:
            return { ...state, oUser: action.oUser };
        case REMOVE_USERDETAILS:
            return { ...state, oUser: null };
        default:
            return state;
    }
};