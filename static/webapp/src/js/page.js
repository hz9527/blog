import React from 'react';
import '../transStyles/page.css';
import NavBar from './navBar.js';
import Sign from './signIn';
import Server from './tools/serveConfig';
import Http from './tools/http.js';

export default React.createClass({
	getInitialState(){

		return {
			loading:false,
			nav:{},
			theme:'theme1',
			signShow: true
		}
	},
	componentDidMount(){
		this.init()
	},
	httpUnload: Http(),
	init(){
		//查看是否有session请求是否登陆
		// 查看本地主题默认设置
		var sign,theme;
		this.httpUnload(Server.checkSign.method, Server.checkSign.url, {}).then(function(data){
			if(data.state){
				sign = data.data;
				var that = this;
				setInterval(function(){
					that.httpUnload(Server.message.method, Server.message.url).then(function(data){
						if(data.state){

						}
					})
				},Server.message.time)
			}else{
				sign = {
					sign:false,
					name:'',
					picture:'',
					message: null
				}
			}
			this.setState(sign)
		});

		theme = localStorage.getItem('theme');
		theme = theme === 'theme2' ? 'theme2' : 'theme1';
		this.setState({theme: theme})
	},
	changeState(obj){
		this.setState(obj);
		console.log()
	},
	render(){
			return(
				<div className={this.state.theme}>
					<NavBar {...this.state.nav} theme={this.state.theme} />
					<Sign show={this.state.signShow} changeProps={this.changeState} />
				</div>
			)
	}
});
