import React from 'react';
import '../transStyles/component.css';

export default React.createClass({
	onConfirm(){
		this.props.dealModal(true);
	},
	onCancel(){
		this.props.dealModal(false);
	},
	render(){
		var head,content,foot;
		if(this.props.head){
			head = <div className='head'>{this.props.head}</div>
		}else{
			head = null;
		}
		content = this.props.content;
		if(!this.props.cb){
			foot = null;
		}else if(this.props.cb.confirm && !this.props.cb.cancel){
			foot = <div className='foot'>
								<div className='hz-btn-line-m btn' onClick={this.onConfirm}>{'确认'}</div>
							</div>
		}else if(this.props.cb.confirm && this.props.cb.cancel){
			foot = <div className='foot'>
								<div className='hz-btn-line-m btn' onClick={this.onCancel}>{'取消'}</div>
								<div className='hz-btn-line-m btn' onClick={this.onConfirm}>{'确认'}</div>
							</div>
		}
		return (
			<div className='modal-con'  style={{display: this.props.show ?'block':'none'}}>
				<div className='modal-box'>
					{head}
					<div className='body'>{content}</div>
					{foot}
				</div>
			</div>
		)
	}
})
