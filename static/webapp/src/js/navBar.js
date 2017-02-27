import React from 'react';
import '../transStyles/navBar.css';

export default React.createClass({
		getDefaultProps(){
			// console.log(this.props)
		},
		getInitialState(){
			return {
				asideShow:false,
			}
		},
		sign(e){
			if(e.target.innerHTML === '注册'){
				this.props.changeProps({
					sign:{show: true, signState:'signUp'}
				})
			}else if(e.target.innerHTML === '登录'){
				this.props.changeProps({
					sign:{show: true, signState:'signIn'}
				})
			}
		},
		showAside(){
			this.setState({asideShow:true});
		},
		dealMessage(){
			var that = this;
			this.values.messageList = [];
			this.props.message.forEach(function(item,i){
				if(item>0){
					var t;
					if(i==0){
						 t = '系统消息: ';
					}else if(i==1){
						t = '评论回复消息: '
					}else if(i==2){
						t = '博客评论消息: ';
					}else if(i==3){
						t = '新增粉丝消息: '
					}
					that.values.messageList.push({n:t,v:item});
				}
			});
			this.values.message = this.props.message.reduce(function(pre,item){return pre += item;});
		},
		values:{
			message:0,
			messageList:[]
		},
		render(){
			var menu,sign;
			if(this.props.sign){
				this.dealMessage();
				var titList = [];
				titList.push(<span key='-1'>{'用户名: '+this.props.name}</span>);
				this.values.messageList.forEach(function(item,i){
						titList.push(<span key={i+''}>{item.n + item.v}</span>)
					});
				var message = this.props.message.reduce(function(pre,item){return pre += item;});
				menu = <div className='user'>
									<img src={this.props.picture}/>
									<b className={this.values.messageList.length > 0 ? 'msg' : 'msg-hide'}>{message > 99 ? 99 : message}</b>
									<span className={'tit'}>
										{titList}
									</span>
								</div>
				sign = <div className='sign'></div>
			}else{
				sign = <div className='sign' onClick = {this.sign}>
								<span>{'注册'}</span><span>{'／'}</span><span>{'登录'}</span>
							</div>
			}
			return (
				<div className='nav'>
					<div className='menu' onClick={this.showAside}>
						<b className={this.state.asideShow ? 'icon aside-show' : 'icon'}></b>
						{menu}
					</div>
					<div className='con'>{3}
					</div>
					{sign}
				</div>

			)
		}
	});


	// class NavBar extends Component{
	// 	state = {};
	// 	// props = {};
	// 	// getDefaultProps(){
	// 	// 	console.log(this)
	// 	// };
	// 	constructor(props) {
	//     super(); // or super(props) ?
	// 		console.log(props)
	//   }
	// 	getInitialState(){
	// 		console.log(this);
	// 	}
	// 	render(){
	// 		var menu,sign
	// 		if(this.props.signState){
	//
	// 		}else{
	// 			sign = <div>
	// 							<span>{'注册'}</span><span>{'／'}</span><span>{'登录'}</span>
	// 						</div>
	// 		}
	// 		return (
	// 			<div className='nav'>
	// 				<div className='menu'>{1}</div>
	// 				<div className='con'>{3}
	// 				</div>
	// 				<div className='sign'>{sign}</div>
	// 			</div>
	//
	// 		)
	// 	}
	//
	// }
	// export default NavBar;
