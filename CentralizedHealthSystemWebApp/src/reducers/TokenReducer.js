import { STORE_JWTTOKEN, REMOVE_JWTTOKEN} from '../action/TokenAction';

const initialTokenState = {
    jwtToken: null
};

export const TokenReducer = (state = initialTokenState, action) => {
    switch (action.type) {
        case STORE_JWTTOKEN:
            return { ...state, jwtToken: action.jwtToken };
        case REMOVE_JWTTOKEN:
            return { ...state, jwtToken: null };
        default:
            return state;
    }
};