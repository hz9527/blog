import React from 'react';
import '../transStyles/page.css';
import NavBar from './navBar.js';
import Sign from './signIn';
import Modal from './modal';
import Toast from './toast';
import Aside from './aside';
import Server from './tools/serveConfig';
import {HTTP} from './tools/common.js';

export default React.createClass({
	getInitialState(){
		return {
			loading:false,
			theme:'theme1',
			message:[],
			asideShow:false,
			signState:false,
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
	dealSign(data){
		this.setState({nav:{
			account:data.account,
			name:data.name,
			picture:data.picture,
		},message:data.message,signState:true});
		var that = this;
		window.timer.message = setInterval(function(){
			that.httpUnload(Server.message.method, Server.message.url).then(function(data){
				if(data.state){

				}
			})
		},Server.message.time);
	},
	init(){
		//查看是否有session请求是否登陆
		// 查看本地主题默认设置
		var theme;
		this.httpUnload(Server.checkSign.method, Server.checkSign.url, {}).then(function(data){
			if(data.state === true){
				this.dealSign(data.data);
			}else{
				clearInterval(window.timer.message);
				window.timer.message = null;
				this.setState({nav:{
					account:'',
					name:'',
					picture:'',
					message: null
				},message:[],signState:false});
			}
		});
		theme = localStorage.getItem('theme');
		theme = theme === 'theme2' ? 'theme2' : 'theme1';
		this.setState({theme: theme})
	},
	changeState(obj){
		if(typeof obj == 'object'){
			this.setState(obj);
		}else{
			var arg = Array.prototype.slice.call(arguments,1);
			this[obj].apply(this,arg);
		}
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
			that.toastqueue.shift();
		},t+500);
	},
	toastCtrl(text, t){
		var that = this;
		t = typeof(t) == 'number' && t || 2000;
		this.toastqueue.push(text);
		if(this.toastqueue.length == 1){
			this.dealToast(t);
		}else if(this.toastqueue.length == 2){
			window.timer.toast = setInterval(function(){
				that.dealToast(t);
				that.toastqueue.length == 1 && clearInterval(window.timer.toast);
			},t+1500);
		}
	},
	dealModal(result){
		if(result === true){
			this.refs[this.state.modal.refName][this.state.modal.cb.confirm]();
		}else if(result === false){
			this.refs[this.state.modal.refName][this.state.modal.cb.cancel]();
		}
		this.setState({modal: null});
	},
	closeAside(){this.setState({asideShow:false})},
	render(){
			var pageClass = 'page ' + this.state.theme + (this.state.asideShow ? ' page-aside-show' : '');
			return(
				<div className={pageClass}>
					<div className='page-modal' onClick={this.closeAside}></div>
					<Aside sign={this.state.signState} aside={this.state.asideShow}
						theme={this.state.theme} close={this.closeAside} changeProps={this.changeState} />
					<NavBar {...this.state.nav}  asideShow={this.state.asideShow}
					 message={this.state.message} sign={this.state.signState} changeProps={this.changeState}/>
					<Sign {...this.state.sign} ref='sign' changeProps={this.changeState} toast={this.toastCtrl} ref='sign'/>
					<Modal {...this.state.modal} changeProps={this.changeState} dealModal={this.dealModal}/>
					<Toast {...this.state.toast} ref='toast'/>
				</div>
			)
	}
});
