import React from 'react';
import {HTTP} from './tools/common.js';
import Server from './tools/serveConfig';
import '../transStyles/aside.css'

export default React.createClass({
	getInitialState(){
		return {
			loading: false,
			info:null,
			showInfo: false,
			showLimit:false,
			editInfo:false,
			editLimit:false
		}
	},
	http:HTTP(function(that){
		that.setState({loading: true});
	}, function(that){
		that.setState({loading: false});
	}),
	init(){
		if(this.props.sign === true){
			this.setState({
				showInfo: false,
				showLimit:false,
				editInfo:false,
				editLimit:false
			})
			if(!this.state.info){
				this.http(Server.getOwnInfo.method, Server.getOwnInfo.url)
					.then(function(data){
						this.setState({info: data.data})
					})
				}
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
	transDate(time){
		var result;
		if(typeof time == 'number'){
			result = new Date(time);
			result = [result.getFullYear(), result.getMonth()+1,result.getDate()];
			return result.join('-');
		}else if(typeof time == 'string'){
			result = result.split('-').filter(function(item){return item*1});
			if(isNaN(result[0]) || result[0] < 1970 || result > 2017){
				return false;
			}
			if(isNaN(result[0]) || result[1] < 0 || result >12){
				return false;
			}
			if(isNaN(result[0]) || result[2] < 0 || result >31){
				return false
			}
			result = +new Date(result[0],result[1]-1,result[2]);
		}
		return false
	},
	changeState(prop){
		var obj = {};
		obj[prop] = !this.state[prop];
		this.setState(obj);
	},
	goRoute(type){

	},
	render(){
		var content,infoPanel,limitPanel,editInfoText;
		if(this.state.info){
			infoPanel =
			<div className={this.state.showInfo ? 'pancel' : 'hide'}>
				<div className='head'>
					<div className='hz-btn-line-s-r' onClick={this.changeState.bind(this,'editInfo')}>{this.state.editInfo ? '保存' : '编辑'}</div>
				</div>
				<div className='label'>
					<span className='tit-s'>昵称：</span>
					<input type='text' defaultValue={this.state.info.info.name} className='form-w' disabled={!this.state.editInfo} />
				</div>
				<div className={this.state.info.info.sex || this.state.editInfo ? 'label' : 'hide'}>
					<span className='tit-s'>性别：</span>
					<select defaultValue={this.state.info.info.sex} disabled={!this.state.editInfo}  className='form-w'>
						<option value=''></option>
						<option value='male'>男</option>
						<option value='female'>女</option>
					</select>
				</div>
				<div className={this.state.info.info.birthday || this.state.editInfo ? 'label' : 'hide'}>
					<span className='tit-s'>生日：</span>
					<input type='text' defaultValue={this.transDate(this.state.info.info.birthday) || ''} className='form-w' disabled={!this.state.editInfo} />
				</div>
				<div className='label'>
					<span className='tit-s'>公司：</span>
					<input type='text' defaultValue={this.state.info.info.name} className='form-w' disabled={!this.state.editInfo} />
				</div>
				<div className='label'>
					<span className='tit-s'>职位：</span>
					<input type='text' defaultValue={this.state.info.info.name} className='form-w' disabled={!this.state.editInfo} />
				</div>
				<div className='label'>
					<span className='tit-s'>git主页：</span>
					<input type='text' defaultValue={this.state.info.info.name} className='form-w' disabled={!this.state.editInfo} />
				</div>
				<div className='label'>
					<span className='tit-s'>个人站点：</span>
					<input type='text' defaultValue={this.state.info.info.name} className='form-w' disabled={!this.state.editInfo} />
				</div>
				<div className='label'>
					<span className='tit-s'>个人简介：</span>
					<input type='text' defaultValue={this.state.info.info.name} className='form-w' disabled={!this.state.editInfo} />
				</div>
			</div>
			content =
			<div className='content-sign'>
				<div className='picture'><img src={this.state.info.info.picture}/></div>
				<div className='user_fridend'>
					<p>{this.state.info.info.name}</p>
					<span>关注：{this.state.info.fans.followLength}</span>
					<span>粉丝：{this.state.info.fans.followerLength}</span>
				</div>
					<div className='info-line' onClick={this.changeState.bind(this,'showInfo')}>
					<i></i><span>个人信息</span>
					<b className={this.state.showInfo ? 'up' : 'down'}></b>
				</div>
				{infoPanel}
				<div className='info-line setting' onClick={this.changeState.bind(this,'showLimit')}>
					<i></i><span>默认权限设置</span>
					<b className={this.state.showLimit ? 'up' : 'down'}></b>
				</div>
				{limitPanel}
				<div className='info-line publish' onClick={this.goRoute.bind(this,'publish')}>
					<i></i><span>发布新博客</span><b className='right'></b>
				</div>
				<div className='info-line message' onClick={this.goRoute.bind(this,'message')}>
					<i></i><span>消息</span><b className='right'></b>
				</div>
				<div className='info-line collect' onClick={this.goRoute.bind(this,'collect')}>
					<i></i><span>收藏</span><b className='right'></b>
				</div>
				<div className='info-line published' onClick={this.goRoute.bind(this,'published')}>
					<i></i><span>已发布</span><b className='right'></b>
				</div>
			</div>
		}else{
			content = <div className='content'>
									<div className='hz-btn-line-b'>注册</div>
									<div className='hz-btn-line-b btn'>登录</div>
								</div>
		}
		return (
			<div className='aside'>
				<div className='close' onClick={this.closeAside}>
				</div>
				{content}
				<div className='change-theme'>
					{this.props.theme == 'theme1' ? '使用主题2' : '使用主题1'}
					<div className={this.props.theme == 'theme1' ? 'switch switch-left' : 'switch switch-right'} onClick={this.changeTheme}>
						<div className='switch-item'></div>
					</div>
				</div>
				<div className='space'></div>
				<div className={this.state.loading ? 'aside-loading' : 'aside-loading-hide'}></div>
			</div>
		)
	}
});
