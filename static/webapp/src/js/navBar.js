import React from 'react';
import '../transStyles/navBar.css';

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

export default React.createClass({
		getDefaultProps(){
			// console.log(this.props)
		},
		getInitialState(){
			// console.log(this.props)
			return {}
		},
		render(){
			var menu,sign
			if(this.props.sign){

			}else{
				sign = <div>
								<span>{'注册'}</span><span>{'／'}</span><span>{'登录'}</span>
							</div>
			}
			return (
				<div className='nav'>
					<div className='menu'>{1}</div>
					<div className='con'>{3}
					</div>
					<div className='sign'>{sign}</div>
				</div>

			)
		}
	})
