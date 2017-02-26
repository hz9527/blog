import React from 'react';
import '../transStyles/page.css';
import NavBar from './navBar.js';
import Sign from './signIn';
import Modal from './modal';
import Toast from './toast';
import Server from './tools/serveConfig';
import {HTTP} from './tools/common.js';

export default React.createClass({
	getInitialState(){

		return {
			loading:false,
			theme:'theme1',
			nav:{},
			sign:{},
			modal: {show:true, cb:{confirm:'a'}},//show,refName,head,content,cb:{confirmxx cancelxx}
			toast: {
				// show:true,
				// text: 'xixxxxxxxxxxxxxxxxxxxxxxxxxxxi'
			},//show text
		}
	},
	componentDidMount(){
		this.init();
	},
	httpUnload: HTTP(),
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
	},
	toastqueue:[],
	toastCtrl(text){
		var that = this;
		this.toastqueue.push(text);
		if(this.toastqueue.length == 1){
			this.setState({toast:{show:true, text:this.toastqueue[0]}});
			setTimeout(function(){
				that.setState({toast:{show:false, text:that.toastqueue[0]}});
			},1000);
		}else if(this.toastqueue.length == 2){
			window.timer.toast = setInterval(function(){
				console.log(that.toastqueue)
				that.setState({toast:{show:true, text:that.toastqueue[0]}});
				setTimeout(function(){
					that.setState({toast:{show:false, text:that.toastqueue[0]}});
				},1000);
				that.toastqueue.pop();
				that.toastqueue.length == 0 && clearInterval(window.timer.toast);
			},3000)
		}
	},
	dealModal(result){
		var that = this;
		window.timer.toast2 = setInterval(function(){
			console.log(that.toastqueue)
			that.toastqueue.length == 5 && clearInterval(window.timer.toast2)
			that.toastCtrl('hhh');
		},500)
		// if(result === true){
		// 	this.refs[this.state.modal.refName][this.state.modal.cb.confirm]();
		// }else if(result === false){
		// 	this.refs[this.state.modal.refName][this.state.modal.cb.cancel]();
		// }
		this.setState({modal: null});
	},
	render(){
			return(
				<div className={this.state.theme}>
					<NavBar {...this.state.nav} theme={this.state.theme} changeProps={this.changeState}/>
					<Sign {...this.state.sign} changeProps={this.changeState} ref='sign'/>
					<Modal {...this.state.modal} changeProps={this.changeState} dealModal={this.dealModal}/>
					<Toast {...this.state.toast} changeProps={this.changeState}/>
				</div>
			)
	}
});
