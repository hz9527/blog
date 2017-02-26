import React from 'react';
import '../transStyles/component.css';

export default React.createClass({
	getDefaultProps(){
		return {
			className: 'toast-con toast-hide'
		}
	},
	render(){
		return (
			<div className={this.props.className} >
				<div className='toast-box'>{this.props.text}</div>
			</div>
		)
	}
})
