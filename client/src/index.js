import React from 'react';
import ReactDOM from 'react-dom';
import Routes from './routes/Routes';

import 'normalize.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';
// import './index.css';


ReactDOM.render(
  <React.StrictMode>
    <Routes/>
  </React.StrictMode>,
  document.getElementById('root')
);
