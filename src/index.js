import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import gbMenLogo from './assets/gb-men.png';

const favicon = document.getElementById('app-favicon');
if (favicon) {
  favicon.setAttribute('href', gbMenLogo);
  favicon.setAttribute('sizes', '32x32');
}

const appleTouchIcon = document.getElementById('app-apple-touch-icon');
if (appleTouchIcon) {
  appleTouchIcon.setAttribute('href', gbMenLogo);
  appleTouchIcon.setAttribute('sizes', '180x180');
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();