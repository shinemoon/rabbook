//开始解析页面 
//通用函数，应当针对所有的
var curSearchDomain = null;
function startParse(url){
	//Get Setting	
	//Get the url setting
	curUrl = url;
	curBase= curUrl.replace(/(.*?:\/\/.*?)\/.*/,"$1");
	getSetBasedOnUrl(url,function(config){
		//页面处理
		if(config==null){
			externalShow('解析失败,请到配置搜索页进一步确认！');
			curSearchDomain = getDomain(url);
			chrome.tabs.create({url:"searchSite.html"});
		} else {
			if(config.post=='1'){
				externalShow('解析成功,开始处理:兼容模式，阅读过程中请保持本页面不关闭，如意外关闭，请重新打开再次进行阅读操作。');
			} else {
				externalShow('解析成功,开始处理。');
			}
			parsePage(url,function(info){
				createNewPage(info);
			});
		}
	});
}

//页面处理函数，通用
function parsePage(url, cbFunc){
	/*
	if(curSiteConfig.enable=='false'){
		if(readerTabPort!=null) readerTabPort.postMessage({message:'notify',value:'信息：本站点设置被禁用，请确认配置'});
		if(entryTabPort!=null) entryTabPort.postMessage({message:'notify',value:'信息：本站点设置被禁用，请确认配置'});
		if(bookMarkTabPort!=null) bookMarkTabPort.postMessage({message:'notify',value:'信息：本站点设置被禁用，请确认配置'});
		fakeStub.empty(); 
		return;
	}
	*/

	curUrl = url;
	curBase= curUrl.replace(/(.*?:\/\/.*?)\/.*/,"$1");
	//获取内容
	var curPage = {
		curSite:'',
		curTitle:'',
		curBook:'',
		curChapter:'',
		curContent:'',
		curUrl:'',
		curMenu:'',
		curNext:'',
		curPre:''
	};
	//兼容旧版的后台打开页面机制：
	if(curSiteConfig.post=='1'){
		//判断是否正忙的标志位
		postGet(url,function(data) {
				fakeStub.empty(); 
				try {
					//Disable Script, Avoid any pop up
					data = data.replace(/script/ig,'xscript'); //Claud
					fakeStub.append(data);
					fakeStub.data('curUrl',url);
				} catch(err) {
					console.log(err);
				}
				//patchHere
				applyPatch(function(){
					fakeStub.find('script').remove();//Claud
					//检查是否合法页面
					if((fakeStub.find(curSiteConfig.navigation_selector_pre).length==0) && (fakeStub.find(curSiteConfig.navigation_selector_next).length==0)){
						if(readerTabPort!=null) readerTabPort.postMessage({message:'notify',value:'错误：试图访问非阅读页面,或该页面有排版问题，建议进入原页面进一步分析。',style:'new'});
						externalShow('解析失败,请检查配置。');
						fakeStub.empty(); //Claud
					} else {
						curPage.curUrl = url;
						curPage.curSite = curSiteConfig.name;
						curPage.curSiteUrl = curSiteConfig.address;
						curPage.curTitle = fakeStub.find('title').html().replace(/\n/g,'');
		
						var tmpReg = new RegExp(curSiteConfig.title_reg);
						if(curSiteConfig.title_location=='0'){
							curPage.curBook = curPage.curTitle.replace(tmpReg,'$1');
							curPage.curChapter = curPage.curTitle.replace(tmpReg,'$2');
						} else {
							curPage.curBook = curPage.curTitle.replace(tmpReg,'$2');
							curPage.curChapter = curPage.curTitle.replace(tmpReg,'$1');
						}
	
						//删除掉所有的下划线
						curPage.curBook = curPage.curBook.replace(/_/g,' ');
						curPage.curBook = curPage.curBook.replace(/^\s*(\S+[\s\S]*\S+)\s*/g,'$1');
						curPage.curChapter = curPage.curChapter.replace(/_/g,' ');
						curPage.curChapter = curPage.curChapter.replace(/^\s*(\S+[\s\S]*\S+)\s*/g,'$1');
					
						curPage.curContent = fakeStub.find(curSiteConfig.content_selector);
						//图片处理
						var imgList	=	curPage.curContent.find('img');
						var imgBase = 	curPage.curUrl.replace(/(.*?:\/\/.*?)\/.*/,"$1");
						for(var i =0;i<imgList.length;i++){
							imgList.eq(i).attr("src", parseUrl(imgBase, imgList.eq(i).attr("src")));
						}
	
						curPage.curContent = curPage.curContent.html();
	
						curPage.curMenu = fakeStub.find(curSiteConfig.navigation_selector).attr('href');
						curPage.curPre = fakeStub.find(curSiteConfig.navigation_selector_pre).attr('href');
						curPage.curNext = fakeStub.find(curSiteConfig.navigation_selector_next).attr('href');
						//处理URL
						curPage.curMenu = parseUrl(url,curPage.curMenu);
						curPage.curPre = parseUrl(url,curPage.curPre);
						curPage.curNext = parseUrl(url,curPage.curNext);
						fakeStub.empty(); //
						//Modify Recent list
						var list = [];
						if(typeof(localStorage.recentList)=='undefined'){
							localStorage.recentList = "[]";
						}
						list = JSON.parse(localStorage.recentList);
						var tmpList = [];
						for(var i=0; i<list.length;i++){
							if(list[i].curBook != curPage.curBook){
								tmpList.push(list[i]);
							}
						}
			
						if(tmpList.length >= 5) {
							tmpList.shift();
						}
						tmpList.push(curPage);
						localStorage.recentList = JSON.stringify(tmpList);
		
						refreshBookmark();
						if(typeof(cbFunc)!='undefined'){
							cbFunc(curPage);	
						}
					}
				});
			}); //End of AJax part

	} else { 
		if(typeof(ajaxHdl)=='object'){
			//强行中断
			ajaxHdl.abort();
			//if(ajaxHdl.readyState != 4) {
			//}
		}
		//ajaxHdl = jQuery.get(url,function(data,text,xhr) {
//		ajaxHdl = $.ajax({url:url,success:function(data,text,xhr) {
		ajaxHdl = $.ajax({url:url, 
						  beforeSend:function(xhr){
						  						if(root.curCharset != null) xhr.overrideMimeType('text/html;charset='+ root.curCharset);
											}
						}).done(function(data,text,xhr) {
				fakeStub.empty(); 
				try {
					//Disable Script, Avoid any pop up and now error on inline script
					data = data.replace(/script/ig,'xscript'); //Claud
					//Double check the charset!
					//var possibleCharset = data.match(/Charset=['|"]?(.*?)['|"]?[\s|>]/i);
					var possibleCharset = data.match(/[的一不是在书下上说了]/);
					if(possibleCharset == null) { //基本上中文网页如果没有这些字，肯定是解码有问题, 重试,3次后，放弃尝试，依然用null
						if(root.curCharset == null) {
							root.curCharset = 'gbk';
						} else if(root.curCharset == 'gbk') {
							root.curCharset = 'utf-8';
						}
							//重新整理开始
						if(root.charsetTries++ < 2) {
							parsePage(url, cbFunc);
						} else {
							root.charsetTries = 0;
							root.curCharset = null;
						}
					} else {
						root.charsetTries = 0;
					}
					fakeStub.append(data);
					fakeStub.data('curUrl',url);
				} catch(err) {
					console.log(err);
				}
				//patchHere
				applyPatch(function(){
					fakeStub.find('script').remove();
					//检查是否合法页面
					if((fakeStub.find(curSiteConfig.navigation_selector_pre).length==0) && (fakeStub.find(curSiteConfig.navigation_selector_next).length==0)){
						if(readerTabPort!=null) readerTabPort.postMessage({message:'notify',value:'错误：试图访问非阅读页面,或该页面有排版问题，建议进入原页面进一步分析。',style:'new'});
						externalShow('解析失败,请检查配置。');
						fakeStub.empty(); //Claud
					} else {
						curPage.curUrl = url;
						curPage.curSite = curSiteConfig.name;
						curPage.curSiteUrl = curSiteConfig.address;
						curPage.curTitle = fakeStub.find('title').html().replace(/\n/g,'');
		
						var tmpReg = new RegExp(curSiteConfig.title_reg);
						if(curSiteConfig.title_location=='0'){
							curPage.curBook = curPage.curTitle.replace(tmpReg,'$1');
							curPage.curChapter = curPage.curTitle.replace(tmpReg,'$2');
						} else {
							curPage.curBook = curPage.curTitle.replace(tmpReg,'$2');
							curPage.curChapter = curPage.curTitle.replace(tmpReg,'$1');
						}
	
						//删除掉所有的下划线
						curPage.curBook = curPage.curBook.replace(/_/g,' ');
						curPage.curBook = curPage.curBook.replace(/^\s*(\S+[\s\S]*\S+)\s*/g,'$1');
						curPage.curChapter = curPage.curChapter.replace(/_/g,' ');
						curPage.curChapter = curPage.curChapter.replace(/^\s*(\S+[\s\S]*\S+)\s*/g,'$1');
					
						curPage.curContent = fakeStub.find(curSiteConfig.content_selector);
						//图片处理
						var imgList	=	curPage.curContent.find('img');
						var imgBase = 	curPage.curUrl.replace(/(.*?:\/\/.*?)\/.*/,"$1");
						for(var i =0;i<imgList.length;i++){
							imgList.eq(i).attr("src", parseUrl(imgBase, imgList.eq(i).attr("src")));
						}
	
						var contentHtml='';	
						for(var i =0;i<curPage.curContent.length;i++){
							contentHtml = contentHtml + curPage.curContent.eq(i).html();
						}
						curPage.curContent = contentHtml;
	
						curPage.curMenu = fakeStub.find(curSiteConfig.navigation_selector).attr('href');
						curPage.curPre = fakeStub.find(curSiteConfig.navigation_selector_pre).attr('href');
						curPage.curNext = fakeStub.find(curSiteConfig.navigation_selector_next).attr('href');
						//处理URL
						curPage.curMenu = parseUrl(url,curPage.curMenu);
						curPage.curPre = parseUrl(url,curPage.curPre);
						curPage.curNext = parseUrl(url,curPage.curNext);
						fakeStub.empty(); //Claud
						//Modify Recent list
						var list = [];
						if(typeof(localStorage.recentList)=='undefined'){
							localStorage.recentList = "[]";
						}
						list = JSON.parse(localStorage.recentList);
						var tmpList = [];
						for(var i=0; i<list.length;i++){
							if(list[i].curBook != curPage.curBook){
								tmpList.push(list[i]);
							}
						}
			
						if(tmpList.length >= 5) {
							tmpList.shift();
						}
						tmpList.push(curPage);
						localStorage.recentList = JSON.stringify(tmpList);
		
						refreshBookmark();
						if(typeof(cbFunc)!='undefined'){
							cbFunc(curPage);	
						}
					}
				});
			}); //End of done part
		}
	}


//获得指定的配置
function getSetBasedOnUrl(url,cbFunc){
	//获取reg for url	
	var urlRegs = new Array() ;
	sqlQuery('url_reg,id,name,enable','sites',function(ret){
		urlRegs = ret;
		var hitInd = null;
		for(var i=0; i<urlRegs.length; i++){
			if(urlRegs[i].url_reg!="" && url.match(urlRegs[i].url_reg)){
				if(urlRegs[i].enable=='false'){
//					if(readerTabPort!=null) readerTabPort.postMessage({message:'notify',value:'信息：本站点设置被禁用，请确认配置'});
//					if(entryTabPort!=null) entryTabPort.postMessage({message:'notify',value:'信息：本站点设置被禁用，请确认配置'});
//					if(bookMarkTabPort!=null) bookMarkTabPort.postMessage({message:'notify',value:'信息：本站点设置被禁用，请确认配置'});
					continue;
				} else {
					hitInd = urlRegs[i].id;
					break;
				}
			}
		}
		//根据结果取得配置//
		if(hitInd!=null){
			sqlQuery('*','sites',function(ret){
				curSiteConfig = ret[0];
				var curConfig = new Object();
				curConfig = jQuery.extend({},ret[0]);
				cbFunc(curConfig);
			}, "where id = '" + hitInd + "';");
		} else {
			curSiteConfig = null;
			cbFunc(null);
		}
	});
}


function getUpdateInfo(url,fullurl,cbFunc,instub,index){
	var stub;
	if(typeof(instub)=='undefined'){
		stub = fakeStub;
	} else {
		stub = instub;
	}
	//1. Get Config
	//Get the url setting
	getSetBasedOnUrl(url,function(config){
		//页面处理
		if(config==null){
			console.log(url+':解析失败,请检查配置。');
			cbFunc(stub,index);
		} else {
			updateParseConfig(config,url,fullurl,cbFunc,instub,index,stub);
		}
	});
}

function updateParseConfig(config,url,fullurl,cbFunc,instub,index,stub) {
		console.log('解析成功,开始处理。');
		var updateConfig = config;
		var reg;
		var rep;
		var updateUrl;
		//Check if Advance option is set
		if(updateConfig.updateInfoPage == ""){
			stub =$("<div>N/A</div>");
			cbFunc(stub,index);
		} else {
			//可以是目录选择
			if(updateConfig.updateInfoPage !='INDEX'){
				reg= updateConfig.updateInfoPage.replace(/REPLACE:(.*) WITH:(.*)/,'$1');
				rep= updateConfig.updateInfoPage.replace(/REPLACE:(.*) WITH:(.*)/,'$2');
				reg = new RegExp(reg);
				updateUrl = url.replace(reg,rep);
			} else {
				var realMenu = fullurl.replace(/.*?_\[menu\]_(.*)/, '$1');
				updateUrl = realMenu;
				root.curUrl = url;
				updateUrl = parseUrl(url,updateUrl);
			}

			ajaxHdl = $.ajax({url:updateUrl, 
					  beforeSend:function(xhr){
					  						if(root.curCharset != null) xhr.overrideMimeType('text/html;charset='+ root.curCharset);
										}
					}).done(function(data,text,xhr) {
				var vstub = $("<div></div>");
				data = data.replace(/script/ig,'xscript'); //Claud
				var possibleCharset = data.match(/[的一不是在书上下说了]/);
				if(possibleCharset == null) { //基本上中文网页如果没有这些字，肯定是解码有问题, 重试,3次后，放弃尝试，依然用null
					if(root.curCharset == null) {
						root.curCharset = 'gbk';
					} else if(root.curCharset == 'gbk') {
						root.curCharset = 'utf-8';
					}
					//重新整理开始
					if(root.charsetTries++ < 2) {
						//Redo
						updateParseConfig(config,url,fullurl,cbFunc,instub,index,stub);
					} else {
						root.charsetTries = 0;
						root.curCharset = null;
					}
				} else {
					root.charsetTries = 0;
				}
				vstub.append(data);
				vstub.find('script').remove();
				stub = vstub.find(updateConfig.updateDiv);
				applyPatchUpdate(updateConfig,stub,index,function(info,ind){
					cbFunc(info,ind);
				});
			}); //End of Done

		}
	}

function postGet(url,cbFunc){
	if(entryBusy) return;

	entryBusy = true;
	//Post handling;
	//兼容模式下自动关闭
	var cfg = JSON.parse(root.localStorage.generalReaderSetting);
	if(typeof(cfg.autoclose)=='undefined') cfg.autoclose = "disable";
	if(cfg.autoclose == "enable"){
		if(entryTabPort!=null){ 
			chrome.tabs.remove(entryTab.id);
			entryTabPort = null;
		}
	} else {
	}

	if(entryTabPort==null){
	//新建entry
		chrome.tabs.create({url:url,selected:false},function(tab){
			entryTabPort = null;
			chrome.tabs.insertCSS(tab.id, {file:'css/showUI.user.css'});
			chrome.tabs.executeScript(tab.id, {file:'js/showUI.user.js'}, function(){
				entryTabPort.postMessage({message:'fetchContent',value:url});
				(function waitBusy() {
				  setTimeout(function() {
				    if (entryBusy) {
						waitBusy();
				    } else {
						cbFunc(entryData);
						//兼容模式下自动关闭
						var cfg = JSON.parse(root.localStorage.generalReaderSetting);
						if(typeof(cfg.autoclose)=='undefined') cfg.autoclose = "disable";
						if(cfg.autoclose == "enable"){
							if(entryTabPort!=null){ 
								chrome.tabs.remove(entryTab.id);
								entryTabPort = null;
							}
						} else {
						}
					}
				  }, 1000);
				})();
			});
		});
	} else {
		//用以前的
		//如果是别的页面，需要重新载入
		if(entryTab.url!=url) {
			chrome.tabs.update(entryTab.id,{url:url},function(tab){
				entryTabPort = null;
				chrome.tabs.insertCSS(tab.id, {file:'css/showUI.user.css'});
				chrome.tabs.executeScript(tab.id, {file:'js/showUI.user.js'}, function(){
					entryTabPort.postMessage({message:'fetchContent',value:url});
					(function waitBusy() {
					  setTimeout(function() {
					    if (entryBusy) {
							waitBusy();
					    } else {
							cbFunc(entryData);
						}
					  }, 1000);
					})();
				});
			});
		} else {
			entryTabPort.postMessage({message:'fetchContent',value:url});
			(function waitBusy() {
			  setTimeout(function() {
			    if (entryBusy) {
					waitBusy();
			    } else {
					cbFunc(entryData);
				}
			  }, 1000);
			})();
		}
	}
	
}
