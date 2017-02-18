//mini jq
function $(select){
	return document.querySelector(select);
}
// 注册接口
$('#signUp').onclick=function(){
	$http('post','/sign',{userName:'hz3', passWord:'123456'}).then(
		function(res){
			console.log(res)
		}
	)
}
// 检查账户是否已注册接口
$('#checkSign').onclick=function(){
	$http('get', '/sign?userName=hz3').then(
		function(res){
			console.log(res);
		}
	)
}

// 登录账户
$('#signIn').onclick=function(){
	$http('put', '/sign', {userName:'hz3', passWord:'123456'}).then(
		function(res){
			console.log(res.responseText);
		}
	)
}

$('#changePwd').onclick=function(){
	$http('put', '/api/sign', {userName:'hz3', passWord:'123456', newPassWord:'hz123456'}).then(
		function(res){
			console.log(res)
		}
	)
}

$('#online').onclick = function(){
	$http('post', '/api/sign', {}).then(function(res){
		console.log(res)
	})
}

$('#stopUsing').onclick=function(){
	$http('get', '/api/sign').then(
		function(res){
			console.log(res)
		}
	)
}

$('#updateInfo').onclick = function(){
	$http('post', '/api/userInfo', {info:{sex:'male', company: '58到家'}}).then(function(res){
		console.log(res)
	})
}

$('#userInfo').onclick=function(){
	$http('get', '/api/userInfo?user=1').then(
		function(res){
			console.log(res.responseText);
		}
	)
}

$('#follow').onclick = function(){
	$http('post', '/api/follow', {follow:1}).then(function(res){
		console.log(res.responseText)
	})
}

$('#unfollow').onclick = function(){
	$http('put', '/api/follow', {unFollow:1}).then(function(res){
		console.log(res.responseText)
	})
}
//test info
$('#signUp1').onclick=function(){
	$http('post','/sign',{userName:'hz1', passWord:'123456'}).then(
		function(res){
			console.log(res.responseText);
			$('#user').innerHTML = '当前用户：hz1';

		}
	)
}
$('#signUp2').onclick=function(){
	$http('post','/sign',{userName:'hz2', passWord:'123456'}).then(
		function(res){
			console.log(res.responseText);
			$('#user').innerHTML = '当前用户：hz2';
		}
	)
}
$('#signUp3').onclick=function(){
	$http('post','/sign',{userName:'hz3', passWord:'123456'}).then(
		function(res){
			console.log(res.responseText);
			$('#user').innerHTML = '当前用户：hz3';
		}
	)
}

$('#signIn1').onclick=function(){
	$http('put', '/sign', {userName:'hz1', passWord:'123456'}).then(
		function(res){
			console.log(res.responseText);
			$('#user').innerHTML = '当前用户：hz1';
		}
	)
}
$('#signIn2').onclick=function(){
	$http('put', '/sign', {userName:'hz2', passWord:'123456'}).then(
		function(res){
			console.log(res.responseText);
			$('#user').innerHTML = '当前用户：hz2';
		}
	)
}
$('#signIn3').onclick=function(){
	$http('put', '/sign', {userName:'hz3', passWord:'123456'}).then(
		function(res){
			console.log(res.responseText);
			$('#user').innerHTML = '当前用户：hz3';
		}
	)
}


$('#follow1').onclick = function(){
	$http('post', '/api/follow', {follow:1}).then(function(res){
		console.log(res.responseText)
	})
}
$('#follow2').onclick = function(){
	$http('post', '/api/follow', {follow:2}).then(function(res){
		console.log(res.responseText)
	})
}
$('#follow3').onclick = function(){
	$http('post', '/api/follow', {follow:3}).then(function(res){
		console.log(res.responseText)
	})
}

$('#visit1').onclick=function(){
	$http('get', '/api/userInfo?user=1').then(
		function(res){
			console.log(res.responseText);
			$('#visit').innerHTML = '访问用户：hz1';
		}
	)
}
$('#visit2').onclick=function(){
	$http('get', '/api/userInfo?user=2').then(
		function(res){
			console.log(res.responseText);
			$('#visit').innerHTML = '访问用户：hz2';
		}
	)
}
$('#visit3').onclick=function(){
	$http('get', '/api/userInfo?user=3').then(
		function(res){
			console.log(res.responseText);
			$('#visit').innerHTML = '访问用户：hz3';
		}
	)
}

$('#fullInfo').onclick = function(){
	$http('post', '/api/userInfo', {info:{sex:'male', company: '58到家', introduce:'im a feer', duty:'fe'}}).then(function(res){
		console.log(res)
	})
}
$('#changeLimit').onclick = function(){
	var data = {};
	var vl = $('#visitLimit').value;
	var il = $('#infoLimit').value;
	vl && vl*1 == vl && (data.visitLimit = vl*1);
	il && il*1 == il && (data.infoLimit = il*1);
	if(JSON.stringify(data) == '{}'){
		alert('请填写权限修改值或合法权限值');
	}else{
		$http('put', '/api/userInfo', {limit:data}).then(function(res){
			$('#visitLimit').value = '';
			$('#infoLimit').value = '';
			console.log(res.responseText);
		})
	}
}

//
$('#getMessageList').onclick=function(){
	$http('post', '/api/message',{condition:{},option:{}}).then(
		function(res){
			console.log(res.responseText);
		}
	)
}

$('#readMessage').onclick=function(){
	$http('put', '/api/message',{readList:[1]}).then(
		function(res){
			console.log(res.responseText);
		}
	)
}

$('#getMsgCount').onclick=function(){
	$http('get', '/api/message').then(
		function(res){
			console.log(res.responseText);
		}
	)
}






function $http(method,url,params){
	var xhr=getXhr();
	params&&(params=JSON.stringify(params));
	xhr.then=function(cb){
		this.next=cb;
	}
	xhr.open(method,url);
	xhr.setRequestHeader('Content-Type','application/json');
	xhr.send(params || null);
	xhr.onreadystatechange=function(){
		if(xhr.readyState==4&&(xhr.status==200||xhr.status>=300&&xhr.status<=304)){
			xhr.next(xhr);
		}
	}
	return xhr;
}
function getXhr(){
	var xhr=null;
	if(XMLHttpRequest){
		xhr = new XMLHttpRequest();
	}else{
		xhr = new ActiveXObject('Microsoft.XMLHttp');
	}
	return xhr;
}
