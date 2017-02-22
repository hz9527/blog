import React, { Component } from 'react';
import logo from '../logo.svg';
import '../styles/App.css';
import '../styles/transStyles/common.css'

class App extends Component {
	componentDidMount(){
		this.http('post', '//127.0.0.1:18003/sign',{userName:'hz3',passWord:'123456'}).then(function(res){
			console.log(this)
		})
	}
  render() {
    return (
      <div className="App">
        <div className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <h2>Welcome to React</h2>
        </div>
        <p className="App-intro">
          To get started, edit <code>src/App.js</code> and save to reload.
        </p>
      </div>
    );
  }
}

export default App;
