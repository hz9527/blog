import React from 'react';
import '../transStyles/signModal.css'

export default React.createClass({
	getDefaultProps(){

	},
	getInitialState(){
		return {
			up: false,
			type: 'signIn',
			pwdState: true,
			loading:false,
			pwdState2: true
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
	changeType(){
		this.setState({type: this.state.type == 'signIn' ? 'signUp' : 'signIn'})
	},
	submit(){
		console.log(1)
		if(!this.state.loading){
			console.log(2)
			this.setState({loading:true});
		}
	},
	closeModal(e){
		if(e.target.classList.contains('sign-modal')){
			this.props.changeProps({signShow: false});
		}
	},
	render(){
		var signUp,submitText;
		if(this.state.type == 'signIn'){
			signUp = null;
		}else{
			signUp = <div className={this.state.pwdState2 ? 'label pwd show-pwd' : 'label pwd'}>
								<input onFocus={this.focus.bind(this,'focus')} onBlur={this.focus.bind(this,'blur')}
									type={this.state.pwdState2 ? 'password' : 'text'} className='input' placeholder='请再次输入密码'/>
								<span onClick={this.changePwdState.bind(this,'state2')}></span>
							</div>
		}
		if(this.state.loading){
			submitText = this.state.type == 'signIn' ? '登录中...' : '注册中...';
		}else{
			submitText = this.state.type == 'signIn' ? '登录' : '注册';
		}
		return (
			<div className={this.state.type == 'signIn' ? 'sign-modal' : 'sign-modal sign-up'}
					style={{display: this.props.show?'block':'none'}} onClick={this.closeModal}>
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
							<input type='text' className='input' placeholder='请输入用户名'/>
						</div>
						<div className={this.state.pwdState ? 'label pwd show-pwd' : 'label pwd'}>
							<input onFocus={this.focus.bind(this,'focus')} onBlur={this.focus.bind(this,'blur')}
								type={this.state.pwdState ? 'password' : 'text'} className='input' placeholder='请输入密码'/>
							<span onClick={this.changePwdState}></span>
						</div>
						{signUp}
					</div>
					<div className='foot'>
						<span onClick={this.changeType}>{this.state.type == 'signIn' ? '还没帐号？现在去注册' : '已有帐号，现在去登录'}</span>
						<div className='submit hz-btn-m-r' onClick={this.submit}>{submitText}</div>
					</div>
				</div>
				<div className={this.state.loading ? 'loading' : 'unloading'}></div>
			</div>
		)
	}
})
