export const STORE_USERDETAILS = "STORE_USERDETAILS";

export const storeUserDetails = (oUser) => {
  return { type: STORE_USERDETAILS, oUser: oUser };
};

export const REMOVE_USERDETAILS = "REMOVE_USERDETAILS";

export const removeUserDetails = () => {
  return { type: REMOVE_USERDETAILS };
};
