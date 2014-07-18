var root = chrome.extension.getBackgroundPage();
var userTable={};
var CBFunction;
var CBParameters;

// Common
function showUser(data,type,style){
	if(style==='console') {
		if(type==='kuaipan'){
			console.log("====================================");
			console.log("	Name: " + data.user_name );
			console.log("====================================");
		}
	}
	if(style==='page') {
		if(type==='kuaipan'){
			console.log(data);
			console.log("====================================");
			console.log("	Name: " + data.user_name );
			console.log("====================================");
		}
	}

	console.log('Show Done!');
}

// oAuth Entry
function authorToken(type) {
	if(root.busy == true){
		return;
	}
	root.busy=true;
	//Check if in any action?
	if(type=="kuaipan") {
		setTimeout(function(){root.oauth.authorize(function() {alert('Authorize Done!');});}, 100); //don't use alert to bring page up!
	}
	root.busy=false;
}

function clearToken(type) {
	root.oauth.clearTokens();
	syncStatus(type);
	notify('同步连接断开!','new');
}

function authorMix(type, UCBFunction,parameters,syn) {
	if(root.busy == true){
		return;
	}
	//restart timer


	if(!checkToken(type)) {
		notify('请进行认证!', 'new');
	} else {
	}
	root.busy=true;
	CBFunction = UCBFunction;
	CBParameters = parameters;
	if(typeof(syn)!='undefined') {
		parameters = parameters.push(syn);
	}
	//Check if in any action?

	if(type=="kuaipan") {
		if(typeof(syn)=='undefined') {
			root.oauth.authorize(function() {if(typeof(CBFunction)!='undefined') { return CBFunction.apply(this,CBParameters);}});
		} else {
			root.oauth.authorize(function() {if(typeof(CBFunction)!='undefined') { return CBFunction.apply(this,CBParameters);}});
		}
	}
	root.busy=false;
}

// Just Auth
function justAuth(type){
	if(checkToken(type)) {
		clearToken(type);
		$('.connect').html('连接');
	} else {
		authorMix(type, getUserInfo, [type]);
	}	
}

/*++++++++++++++++++++++++++++
  	Get User Info 
  ++++++++++++++++++++++++++++*/

// Common Func
function getUserInfoCB(resp, xhr, type) {
  // ... Process text response ...
  var respJson = JSON.parse(resp);
  //console.log (JSON.parse(xhr.responseText));
  if(respJson.msg && respJson.msg==="check sign error") {
  	if(type ==='kuaipan') {
  		localStorage.removeItem('oauth_tokenhttp://www.kuaipan.cn/');
  		localStorage.removeItem('oauth_token_secrethttp://www.kuaipan.cn/');
	}
	console.log('Authorize Failed, Please ReTry!');
	authorToken(type);
  } else {
  	//Handle user Info:
	if(type==='kuaipan') {
		console.log(xhr);
		data = JSON.parse(xhr.responseText);
		chrome.storage.local.set ({'clouduser':data});
		showUser(data,'kuaipan','page');
		//确认文件状态
		checkDataStatus('kuaipan');
		syncStatus('sync-status');
	}
	$('h1 .connect').html('断开');
  }
};
// Get User Info
function getUserInfo(type) {
	if(type === "kuaipan") {
	  var url = 'http://openapi.kuaipan.cn/1/account_info';
	  var request = {
	    'method': 'GET',
	    'format': 'JSON'
	  };
	  try{
	  	if(typeof(syn)=='undefined') {
  	  	//	root.oauth.sendSignedRequest(url, getUserInfoCB, request,'kuaipan');
  	  		root.oauth.sendSignedRequest(url, getUserInfoCB, null,'kuaipan');
		} else {
  	  		root.oauth.sendSignedRequest(url, getUserInfoCB, null,'kuaipan',true);
		}
	  }
	  catch(err){
	  }
		
	}
};

/*++++++++++++++++++++++++++++
  	Get Timeline
  ++++++++++++++++++++++++++++*/


//Check Function
function checkToken(type){
	if(type == 'kuaipan') {
  		if((typeof(localStorage['oauth_tokenhttp://www.kuaipan.cn/'])=='undefined') ||( typeof(localStorage['oauth_token_secrethttp://www.kuaipan.cn/'])=='undefined') ){
			return false;
		}
	}
	if(type == 'obc') {
  		if((typeof(localStorage['oauth_tokenhttp://localhost/book/'])=='undefined') ||( typeof(localStorage['oauth_token_secrethttp://localhost/book/'])=='undefined') ){
			return false;
		}
	}

	return true;
}

