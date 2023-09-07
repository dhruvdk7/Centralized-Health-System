export const STORE_JWTTOKEN = 'STORE_JWTTOKEN';
 
export const storeJwtToken = (jwtToken) => {
    return { type: STORE_JWTTOKEN, jwtToken: jwtToken };
};

export const REMOVE_JWTTOKEN = 'REMOVE_JWTTOKEN';
 
export const removeJwtToken = () => {
    return { type: REMOVE_JWTTOKEN };
};
