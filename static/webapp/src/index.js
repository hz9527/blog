import React from 'react';
import ReactDOM from 'react-dom';
import App from './js/App';
import HTTP from './js/tools/http.js'
import './index.css';

React.Component.prototype.http=HTTP(function(that){
	that.setState({loading: true})
});
React.Component.prototype.httpUnload=HTTP();
console.log(React);
ReactDOM.render(
  <App />,
  document.getElementById('root')
);
