var port;
var root = chrome.extension.getBackgroundPage();
setTimeout(function(){configInit();},1);
function configInit(){
	$(document).ready(function(){
//		port = chrome.extension.connect(root.serialNo,{name:'config_page'});
		if(checkToken('kuaipan')) {
			$('#synccontrol').html('云存储');
			$('h1 .connect').html('断开');
		} else {
			$('#synccontrol').html('云存储');
			$('h1 .connect').html('连接');
		}	
		port = chrome.extension.connect({name:'config_page'});
	  	port.onMessage.addListener(function(msg) {
			switch(msg.message){
				case 'notify':
					notify(msg.value, msg.style);
					break;
				case 'refresh content':
//					self.location='bookmarks.html';
					break;
				default:
			}
		});
		//初始，设为阅读页面
		$('.config-menu-item').click(function(){
			$('.config-menu-item').removeClass('valid');
			$(this).addClass('valid');
			switch($(this).attr('name')){
				case 'reader':
					refreshReaderConfig();
					break;
				case 'skin':
					skinConfig();
					break;
				case 'skinCustom':
					skinCustomConfig();
					break;
				case 'bookmark':
					refreshBookmarkConfig();
					break;
				case 'get-sites':
					//从远端获取站点配置，此时仅支持极小集合
					getRemoteConfig();
					break;
				case 'sites':
					refreshSiteConfig('official',function(){
						optScroll();
					});
					break;
				case 'customize':
					refreshSiteConfig('customize', function(){
						optScroll();
					});
					break;
				case 'export-all':
					exportSites('all');
					break;
				case 'import':
					importSite();
					break;
				case 'sync-status':
					syncStatus('sync-status');
					break;
				case 'kuaipan':
					//justAuth('kuaipan');
					syncStatus('sync-status');
					break;
				case 'obc':
					obcStatus('obc-status');
					break;
				case 'weibo':
					weiboStatus();	
					break;
				case 'kuaipan-clear':
					clearToken('kuaipan');
					syncStatus('sync-status');
					break;
				default:
			}
			optScroll();	
		});

		$('.sub-config-panel.general').show();
		$('.config-menu-item.reader').click();

		$('.action-line.head').click(function(){
			$('.sub-config-panel').hide();
			$('.sub-config-panel.'+$(this).attr('value')).show();
			$('.sub-config-panel.'+$(this).attr('value')+" .config-menu-item:first").click();
		});
			

		//simple icons
		$('.sina').click(function(){
			chrome.tabs.create({url:'http://weibo.com/claudxiao'});
		});
		$('.tencent').click(function(){
			chrome.tabs.create({url:'http://t.qq.com/shinemoon'});
		});
		$('.fanfou').click(function(){
			chrome.tabs.create({url:'http://fanfou.com/shinemoon'});
		});
		$('.twitter').click(function(){
			chrome.tabs.create({url:'http://twitter.com/claudxiao'});
		});
		$('.forum').click(function(){
			chrome.tabs.create({url:'http://tieba.baidu.com/rabbook'});
		});


		//Dynamic binding
		$('#main').on('click','.top-control.home',function(){
			refreshSiteConfig('customize', function(){optScroll();});
		});

		$('#main').on('click','.top-control.submit',function(){
			if(confirm("网上提交仅支持非加密型配置数据，同时请确认网站上无重复配置，以避免浪费时间，多谢！")){
				alert("标题请正确填写网站名，正文请粘帖配置内容!");
				chrome.tabs.create({url:root.onlinebase + "/submit"});
			}
		});



		$('#main').on('click','.top-control.export.nowactive',function(){
			exportSites('single',$(this).data('id'));
		});

		$('#main').on('click','.top-control.online',function(){
			chrome.tabs.create({url:root.onlinebase+"/?tag="+getDomain($(this).data('address'))});
		});


		$('#main').on('click','.top-control.save',function(){
			saveCurrentInfo();
		});

		$('#main').on('click','.top-control.trash.nowactive',function(){
			deleteCurrentInfo();
		});


		$('#main').on('click','.top-control.connect',function(){
					if($('.loader-span').hasClass('run')==false) {
						justAuth('kuaipan');
					} 
		});
		$('#main').on('click','.top-control.obc-connect',function(){
			if(root.obcAuth.hasAccessToken()){
				alert('Token Is Ready!');
			} else {
					root.obcAuth.authorize(function() {
						alert('Authorize Done');
				 	});
			}
		});

		$('#main').on('click','.top-control.weibo-connect',function(){
			if(root.weiboAuth.hasAccessToken()){
				//推出登陆
				$.get("https://api.weibo.com/2/account/end_session.json?access_token=" + root.weiboAuth.getAccessToken() , function(result){
					notify('退出完毕','new');
					weiboStatus();
				});
				root.weiboAuth.clearAccessToken();
			} else {
				root.weiboAuth.authorize(function() {
			    	// Ready for action
					//读取用户
					$.get("https://api.weibo.com/2/users/show.json?access_token=" + root.weiboAuth.getAccessToken() + "&uid=" + root.weiboAuth.get('uid'), function(result){
						chrome.storage.local.set({'weiboname':result.name});
						weiboStatus();
						notify('连接完毕','new');
					});
			  	});
			}
		});


		$('#notify').hover(function(){
			$(this).hide();
		});

	chrome.storage.local.get({'datasynchistory':{'lastupdatetime':'从未','lastsize':'不详'}}, function(item){
	chrome.storage.local.get({'localConfigTimestamp': '1900-01-01 00:00:00'}, function(litem){
		$('a.arrowup').bind('click', function(){
			if($('.loader-span').hasClass('run')) {
				return false;	
			}
			if(root.oauth.hasToken()) {
				//compare
				var ltime = new Date(Date.parse(litem.localConfigTimestamp));
				var rtime = new Date(Date.parse(item.datasynchistory.lastupdatetime));
				if(ltime < rtime && litem.localConfigTimestamp!="1900-01-01 00:00:00"){
					if(confirm("本地配置文件旧于云端配置，确认替换？")){
						uploadConfigFile('kuaipan');	
					}
				} else if(ltime == rtime){
					if(confirm("已经同步，确认需要替换？")){
						uploadConfigFile('kuaipan');	
					}
				} else {
					if(confirm("确认要上传覆盖文件？")){
						uploadConfigFile('kuaipan');	
					}
				}
			} else {
				notify('未连接云存储， 请先往设置页面进行认证');
				justAuth('kuaipan');
			}
		});

		$('a.arrowdown').bind('click', function(){
			if($('.loader-span').hasClass('run')) {
				return false;	
			}
			if(root.oauth.hasToken()) {
				var ltime = new Date(Date.parse(litem.localConfigTimestamp));
				var rtime = new Date(Date.parse(item.datasynchistory.lastupdatetime));
				if(item.datasynchistory.lastupdatetime == "从未")  {
					alert("无云端配置文件");
				} else if(ltime > rtime){
					if(confirm("本地配置文件新于云端配置，确认替换？")){
						downloadConfigFile('kuaipan');	
					}
				} else if(ltime == rtime){
					if(confirm("已经同步，确认需要恢复？")){
						downloadConfigFile('kuaipan');	
					}
				} else {
					if(confirm("确认要下载恢复配置？")){
						downloadConfigFile('kuaipan');	
					}
				}
			} else {
				notify('未连接云存储， 请先往设置页面进行认证');
				justAuth('kuaipan');
			}
		});
	});	//ltime
	}); //item


		/*
		//禁止右键
	　　function blockContextmen(){
	　　　　if(window.event){
	　　　　　　window.event.returnValue=false;
	　　　　}
	　　}
　　	document.oncontextmenu=blockContextmen;
		*/
		var middleStub = $("<div></div>");
		middleStub.load("http://rabbook.diandian.com .post.text:first", function(data){
			var realUrl="";
			realUrl = middleStub.find('a:first').attr('href');
			$('.middle-info .info-content').empty();
			$('.middle-info .info-content').append("<a href="+realUrl+" target=_blank></a>");
			$('.middle-info .info-content a').html(middleStub.find("a:first").text());
		});


	});
}

function optScrollBackup(){
		$('.left-panel').mCustomScrollbar('destroy');
		$('.left-panel').mCustomScrollbar({
			mousewheel:true,
	        scrollButtons:{
	          enable:false
		    },
			theme:'dark-thin'
		});
}
function optScroll(){
		$('.middle-panel').mCustomScrollbar('destroy');
		$('.left-panel').mCustomScrollbar('destroy');
		//scroll
		$('.middle-panel').mCustomScrollbar({
			mousewheel:true,
	        scrollButtons:{
	          enable:false
		    },
			advanced:{
    			updateOnContentResize: true,
			    normalizeMouseWheelDelta: true
			},
			theme:'dark-2'
		});
		$('.left-panel').mCustomScrollbar({
			mousewheel:true,
	        scrollButtons:{
	          enable:false
		    },
			advanced:{
    			updateOnContentResize: true,
			    normalizeMouseWheelDelta: true
			},
			theme:'dark-thin'
		});



}

