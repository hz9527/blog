import React from 'react';
import {HTTP} from './tools/common.js';
import Server from './tools/serveConfig';
import '../transStyles/aside.css'

export default React.createClass({
	getInitialState(){
		return {
			loading: false,
			info:null
		}
	},
	http:HTTP(function(that){
		that.setState({loading: true});
	}, function(that){
		that.setState({loading: false});
	}),
	init(){
		if(this.props.sign === true){
			this.http(Server.getOwnInfo.method, Server.getOwnInfo.url)
			.then(function(data){
				console.log(data)
			})
		}else{
			this.setState({info: null});
		}
	},
	componentWillReceiveProps(){
		if(!this.props.aside){
			this.init();
		}
	},
	closeAside(){
		this.props.close();
	},
	changeTheme(){
		var result = this.props.theme == 'theme1' ? 'theme2' : 'theme1';
		this.props.changeProps({theme: result});
		localStorage.setItem('theme',result);
	},
	render(){
		var content;
		if(this.props.sign){
			content = <div>'sign'</div>
		}else{
			content = <div>'no sign'</div>
		}
		return (
			<div className='aside'>
				<div className='close' onClick={this.closeAside}>
					<span className='height'></span><span className='width'></span>
				</div>
				{content}
				<div className='change-theme'>
					{this.props.theme == 'theme1' ? '使用主题2' : '使用主题1'}
					<div className={this.props.theme == 'theme1' ? 'switch switch-left' : 'switch switch-right'} onClick={this.changeTheme}>
						<div className='switch-item'></div>
					</div>
				</div>
				<div className={this.state.loading ? 'aside-loading' : 'aside-loading-hide'}></div>
			</div>
		)
	}
});
