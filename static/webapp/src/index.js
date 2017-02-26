import React from 'react';
import ReactDOM from 'react-dom';
import Page from './js/page';
import {HTTP} from './js/tools/common.js'
import './transStyles/reset.css';

React.Component.prototype.http=HTTP(function(that,key){
	var o = {};
	o[key] = true;
	that.setState(o);
},function(that,key){
	var o = {};
	o[key] = false;
	that.setState(o);
});
React.Component.prototype.httpUnload=HTTP();

ReactDOM.render(
  <Page />,
  document.getElementById('root')
);
