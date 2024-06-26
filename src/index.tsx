// src/index.tsx
import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import reportWebVitals from './reportWebVitals';
import Login from './login';
import App from './App';
import { getCookie } from './utils/cookies';

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);

const isLoggedIn = getCookie('username') !== null;
// console.log(isLoggedIn)
root.render(
  <React.StrictMode>
    {isLoggedIn ? <App /> : <Login />}
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
