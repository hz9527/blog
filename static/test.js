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
