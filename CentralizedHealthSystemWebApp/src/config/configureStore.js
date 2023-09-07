import { createStore, combineReducers } from "redux";
import reducers from "../reducers";
import { persistStore, persistReducer } from "redux-persist";
import sessionstorage from "redux-persist/lib/storage/session";

const persistConfig = {
  key: "CSCI5308_Project_G18",
  storage: sessionstorage,
  whitelist: ["UserReducer", "TokenReducer"],
};

const persistedReducer = persistReducer(
  persistConfig,
  combineReducers({ ...reducers })
);

export const store = createStore(
  persistedReducer,
  {},
  window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()
);
export const persistor = persistStore(store);
