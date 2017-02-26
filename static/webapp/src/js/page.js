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
			modal: {},//show,refName,head,content,cb:{confirmxx cancelxx}
			toast: {},//className text
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
	dealToast(t){
		var that = this;
		that.setState({toast:{className:'toast-con toast-transition', text:this.toastqueue[0]}});
		setTimeout(function(){
			that.setState({toast:{className:'toast-con',text:that.toastqueue[0]}});
		},500);
		setTimeout(function(){
			that.setState({toast:{className:'toast-con toast-transition',text:that.toastqueue[0]}});
		},t);
		setTimeout(function(){
			that.setState({toast:{className:'toast-con toast-hide'}});
		},t+500);
	},
	toastCtrl(text, t){
		var that = this;
		t = t || 2000;
		console.log(this.setState)
		this.toastqueue.push(text);
		if(this.toastqueue.length == 1){
			this.dealToast(t);
		}else if(this.toastqueue.length == 2){
			window.timer.toast = setInterval(function(){
				that.toastqueue.shift();
				that.dealToast(t);
				that.toastqueue.length == 1 && clearInterval(window.timer.toast);
			},t+1500);
		}

	},
	text:'hh',
	dealModal(result){
		if(result === true){
			this.refs[this.state.modal.refName][this.state.modal.cb.confirm]();
		}else if(result === false){
			this.refs[this.state.modal.refName][this.state.modal.cb.cancel]();
		}
		this.setState({modal: null});
	},
	render(){
			return(
				<div className={this.state.theme}>
					<NavBar {...this.state.nav} theme={this.state.theme} changeProps={this.changeState}/>
					<Sign {...this.state.sign} changeProps={this.changeState} ref='sign'/>
					<Modal {...this.state.modal} changeProps={this.changeState} dealModal={this.dealModal}/>
					<Toast {...this.state.toast} ref='toast'/>
				</div>
			)
	}
});
