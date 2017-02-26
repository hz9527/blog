import React from 'react';
import '../transStyles/navBar.css';

export default React.createClass({
		getDefaultProps(){
			// console.log(this.props)
		},
		getInitialState(){
			// console.log(this.props)
			return {}
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
		render(){
			var menu,sign
			if(this.props.sign){
				sign = <div className='sign'></div>
			}else{
				sign = <div className='sign' onClick = {this.sign}>
								<span>{'注册'}</span><span>{'／'}</span><span>{'登录'}</span>
							</div>
			}
			return (
				<div className='nav'>
					<div className='menu'>{1}</div>
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
