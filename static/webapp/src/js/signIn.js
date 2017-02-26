import React from 'react';
import '../transStyles/signModal.css';
import {HTTP, THROTTLE} from './tools/common';
import Server from './tools/serveConfig';

export default React.createClass({
	getDefaultProps(){
	},
	getInitialState(){
		return {
			up: false,
			pwdState: false,
			loading:false,
			pwdState2: false,
			userTip:'',
			pwdTip:'',
			pwd2Tip:'',
			userUse:false,
			pwdUse:false,
			timer:null,
			checkUser:false
		}
	},
	focus(type){
		if(type == 'focus'){
			this.setState({up:true});
		}else{
			this.setState({up:false});
		}
	},
	changePwdState(type){
		if(type !== 'state2'){
			this.setState({pwdState: !this.state.pwdState});
		}else{
			this.setState({pwdState2: !this.state.pwdState2});
		}
	},
	initValue(){
		this.refs['user'].value = '';
		this.refs['pwd'].value = '';
		this.props.signState == 'signUp' && (this.refs['pwd2'].value = '');
		this.setState({
			userTip:'',
			pwdTip:'',
			pwd2Tip:'',
			userUse:false,
			pwdUse:false});
	},
	changeType(){
		this.initValue();
		this.props.changeProps({
			sign:{
				show:true,
				signState: this.props.signState == 'signIn' ? 'signUp' : 'signIn'
			}});
	},
	closeModal(e){
		if(e.target.classList.contains('sign-modal')){
			this.props.changeProps({sign: {show:false}});
			this.initValue();
		}
	},
	httpUnload: HTTP(),
	throttle:THROTTLE,
	inputUser(e){
		if(this.props.signState == 'signUp'){
			var v = e.target.value;
			if(v.length<4 && v.length != 0){
				this.setState({userTip: '用户名不得短于4位字符', userUse: false})
			}else{
				this.setState({userTip: '', userUse: false});
			}
			v.length >= 4 && !this.checkState && this.throttle(function(){
				this.checkState = true;
				this.httpUnload(Server.checkUser.method, Server.checkUser.url + '?userName=' + v)
					.then(function(res){
						this.checkState = false;
						if(res.state){
							this.setState({userTip: '用户名可用', userUse: true});
						}else{
							this.setState({userTip: '用户名不可用', userUse: false});
						}
					})
			},'input',500);
		}else{
			var v = e.target.value;
			if(v.length < 4){this.setState({userTip: '', userUse: false});}
			v.length >= 4 && !this.checkState && this.throttle(function(){
				this.checkState = true;
				this.httpUnload(Server.checkUser.method, Server.checkUser.url + '?userName=' + v)
					.then(function(res){
						this.checkState = false;
						if(res.state){
							this.setState({userTip: '该用户未注册', userUse: false});
						}else{
							this.setState({userTip: '或许你可以用这个帐号登录', userUse: true});
						}
					})
			},'input',500);
		}
	},
	inputPwd(){
		if(this.props.signState == 'signIn'){
			if(this.refs['pwd'].value.length >= 6){
				this.setState({pwdTip:'', pwdUse: true});
			}else if(this.refs['pwd'].value.length < 6 || this.refs['pwd'].value.length == 0){
				this.setState({pwdTip:'', pwdUse: false});
			}
		}else{
			if(this.refs['pwd'].value.length >= 6 && this.refs['pwd2'].value == this.refs['pwd'].value){
				this.setState({pwdTip:'',pwd2Tip:'', pwdUse: true});
			}else{
				this.setState({pwdTip:'',pwd2Tip:'', pwdUse: false});
			}
		}
	},
	a(){
		console.log(111)
	},
	submit(){
		if(!this.state.loading && !this.checkState){
			if(!this.state.userUse){
				this.setState({userTip:'请输入有效用户名'});
				this.refs['user'].focus();
				return
			}
			if(this.props.signState == 'signIn'){
				if(!this.state.pwdUse){
					this.setState({pwdTip:'请输入正确密码'});
					this.refs['pwd'].focus();
				}else{//登录
					var n = this.refs['user'].value;
					var p = this.refs['pwd'].value;
					this.setState({loading:true});
					this.httpUnload(Server.signIn.method, Server.signIn.url, {
						userName: n,
						passWord: p
					}).then(function(res){
						console.log(res);
	 					});
				}
			}else if(this.props.signState == 'signUp'){
				if(!this.state.pwdUse){
					if(this.refs['pwd'].value.length < 6){
						this.setState({pwdTip:'密码长度不得少于6个字符'});
						this.refs['pwd'].focus();
					}else if(this.refs['pwd2'].value.length == 0){
						this.setState({pwd2Tip:'请输入确认密码'});
						this.refs['pwd2'].focus();
					}else if(this.refs['pwd2'].value !== this.refs['pwd'].value){
						this.setState({pwd2Tip:'两次密码不一致'});
						this.refs['pwd2'].focus();
					}
				}else{//注册
					var n = this.refs['user'].value;
					var p = this.refs['pwd'].value;
					this.setState({loading:true});
					this.httpUnload(Server.signUp.method, Server.signUp.url, {
						userName: n,
						passWord: p
					}).then(function(res){
						if(this.state){

						}else{

						}
	 					});
				}
			}
		}
	},
	render(){
		var signUp,submitText;
		if(this.props.signState == 'signIn'){
			signUp = null;
		}else{
			signUp = <div className={this.state.pwdState2 ? 'label pwd show-pwd' : 'label pwd'}>
								<input onFocus={this.focus.bind(this,'focus')} ref='pwd2' onBlur={this.focus.bind(this,'blur')}
									type={this.state.pwdState2 ? 'text' : 'password'} onInput={this.inputPwd}
									className='input' placeholder='请再次输入密码'/>
								<span onClick={this.changePwdState.bind(this,'state2')}></span>
							</div>
		}
		if(this.state.loading){
			submitText = this.props.signState == 'signIn' ? '登录中...' : '注册中...';
		}else{
			submitText = this.props.signState == 'signIn' ? '登录' : '注册';
		}
		return (
			<div className={this.props.signState == 'signIn' ? 'sign-modal' : 'sign-modal sign-up'}
					style={{display: this.props.show ?'block':'none'}} onClick={this.closeModal}>
				<div className={this.state.up? 'content up' : 'content'}>
					<div className='eye-con'>
						<div className='header'>
							<div className='eye'></div>
						</div>
						<div className='left left-down'></div>
						<div className='right right-down'></div>
						<div className='left left-up'></div>
						<div className='right right-up'></div>
					</div>
					<div className='space'></div>
					<div className='form'>
						<div className='label'>
							<input type='text' onInput={this.inputUser} ref='user' className='input' placeholder='请输入用户名'/>
						</div>
						<span className={this.state.userUse ? 'tip tip-s' : 'tip'}>{this.state.userTip}</span>
						<div className={this.state.pwdState ? 'label pwd show-pwd' : 'label pwd'}>
							<input onFocus={this.focus.bind(this,'focus')} ref='pwd' onBlur={this.focus.bind(this,'blur')}
								type={this.state.pwdState ? 'text' : 'password'} onInput={this.inputPwd}
								className='input' placeholder='请输入密码'/>
							<span onClick={this.changePwdState}></span>
						</div>
						<span className='tip'>{this.state.pwdTip}</span>
						{signUp}
						<span className='tip'>{this.state.pwd2Tip}</span>
					</div>
					<div className='foot'>
						<span onClick={this.changeType}>{this.props.signState == 'signIn' ? '还没帐号？现在去注册' : '已有帐号，现在去登录'}</span>
						<div className='submit hz-btn-m-r' onClick={this.submit}>{submitText}</div>
					</div>
				</div>
				<div className={this.state.loading ? 'loading' : 'unloading'}></div>
			</div>
		)
	}
})
