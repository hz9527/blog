import React from 'react';
import '../transStyles/component.css';

export default React.createClass({
	componentDidUpdate(){
		console.log(this.props.show)
		// var that = this;
		// console.log('hhhhhhh');
		// if(window.timer.)
		// setTimeout(function(){
		// 	that.props.changeProps({toast:{show:false, text: that.props.text}});
		// },20000);
	},
	render(){
		return (
			<div className={this.props.show ? 'toast-con' : 'toast-con toast-hide'}>
				<div className='toast-box'>{this.props.text}</div>
			</div>
		)
	}
})
