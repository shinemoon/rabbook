//General Usage
function getCurrentWindow(tabName){
	var wList = chrome.extension.getViews({type:'tab'});
	var result = null;
	for(var i=0; i<wList.length;i++){
		if(tabName == wList[i].tabName){
			result = wList[i];
			break;
		}
	}
	return result;
}

//Parse URL
function parseUrl(base,url){
	if(typeof(url)=='undefined'){
		return '#';
	}
	//get rid of "'
	url = url.replace(/['|"]/ig,'');
	url = url.replace(/\\/ig,'');
	var finalUrl = url;
	if(url.match(/:\/\//)!=null){
		//directed address
	} else if(url.match(/^\/.*/)!=null) {	//Absolute address
		base = base.replace(/(.*:\/\/[^\/]*?)\/.*/,'$1');
		finalUrl = base + url;
	}else { //Relative address
//		base = base.replace(/\/[^\/]*?\/{0,1}$/, '/');
//		finalUrl = base + url;
//		finalUrl = chrome.extension.getBackgroundPage().curPageInfo.curUrl + url;
		var tmpUrl = chrome.extension.getBackgroundPage().curUrl; 
		tmpUrl = tmpUrl.replace(/[^\/]*$/, '');
		finalUrl = tmpUrl + url;
	}
	return finalUrl;
}

//Check if tab existed
function tabExisted(id,cbFunc){
	var tabList;
	chrome.tabs.getAllInWindow(null,function(list){
		var result=false;
		tabList = list; 
		for(var i in tabList) {
			if(tabList[i].id == id) {
				result = true;	
				break;
			}
		}
		cbFunc(result);
	});
}

//Select CSS
function selectCssFile(id,path){
	if(path=='reader-customize.css'){
		var skincfg = JSON.parse(root.localStorage.generalSkinSetting);
		$(id).attr('href','');
		$("style#inline-style").html(skincfg.customize);
	} else {
		$("style#inline-style").html('');
		console.log(path);
		console.log(id);
		$(id).attr('href','/css/' + path);
	}
}

//timing
function getCurrentDate(){
	var cDate = new Date();
	var dStr = cDate.getFullYear()+"-"+(cDate.getMonth()+Number(1))+"-"+cDate.getDate();
	return dStr;
}

//refine String
function refineInfo(info){
	for (var key in info){
		switch(key){
			default:
				info[key] = refineString(String(info[key]));
		}
	}
}

function refineString (str){ //for SQL
	var rStr = str;
	rStr = rStr.replace(/'/g,"''"); //单引号转义
	rStr = rStr.replace(/\n/g,""); //去掉换行
	if(str==null) str = "";
	return rStr;
}

function updateInfo(step){
	//Check If Local Setting is there
	//Count the numbers
	var middleStub = $("<div></div>");
	//middleStub.load("http://claudtest.diandian.com/post/2013-07-10/cnt-blog .entry.rich-content", function(data){});
	if(step == 'big') {
		showNotification('update-notify', '你已经更新到了最新版本！点击查看更新内容.');
	} else {
		showNotification('update-notify-small', '增加了拼音，屏蔽字修复功能。');
	}
	//
}

function showNotification(msgid,msg){
	var opt = {
	  type: "basic",
	  title: "Rabbook 睿读",
	  message: msg,
	  iconUrl: "images/icon.png"
	}
	chrome.notifications.create(msgid, opt, function(){
	});
}

function xescape(str){
	return reverse_change(str)
}

function unxescape(str){
	return reverse_change(str)
}

function reverse_change(str) { 
	var len =  str.length;
	var i; 
	var mystr = ""; 
	for ( var i=len-1;i>=0;i--) { 
		mystr += str.charAt(i); 
	} 
	return mystr;
} 

function getDomain(url) {
	var domain = null;	
	//get url
	var baseurl = url.match(/^\S+:\/\/([^\/]+)($|\/.*)/);
	if(baseurl == null ) return false;
	domain = baseurl[1].match(/[^\.]*?([^\.]+\.[^\.]+)$/);
	if(domain == null ) return false;
	return domain[1];
}
