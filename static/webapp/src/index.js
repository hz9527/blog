import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import HTTP from './js/tools/http.js'
import './index.css';

React.Component.prototype.http=HTTP();

console.log(React);
ReactDOM.render(
  <App />,
  document.getElementById('root')
);
