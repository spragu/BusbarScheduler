import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { SetConnection as SignalRClientSetConnection } from './components/SigRClient'
import { Start as StartSignalRClient } from './components/SigRClient'

const root = ReactDOM.createRoot(document.getElementById('root'));
const connection = SignalRClientSetConnection()
await StartSignalRClient();
root.render(
  <React.StrictMode>
        <App SignalRConnection={ connection } />
  </React.StrictMode>
);
reportWebVitals();
