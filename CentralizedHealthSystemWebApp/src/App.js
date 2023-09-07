import logo from './logo.svg';
import './App.css';
import Routes from './Routes';
import "@fontsource/roboto";
import { store, persistor } from './config/configureStore';
import { PersistGate } from 'redux-persist/integration/react'
import { Provider } from 'react-redux';
import { apiBaseUrl } from './config/commonConfig';
import axios from 'axios';

axios.defaults.baseURL = apiBaseUrl;

function App() {
  return (
    <div className="App" style={{fontFamily: "Roboto"}}>
      <Provider store={store}>
        <PersistGate loading={null} persistor={persistor}>
          <Routes/>
        </PersistGate>
      </Provider>
    </div>
  );
}

export default App;
