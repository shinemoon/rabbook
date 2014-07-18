//execution part

var port;
var root = chrome.extension.getBackgroundPage();
setTimeout(function(){bookMarkInit();},1);
function bookMarkInit(){
	$(document).ready(function(){
		//port = chrome.extension.connect(root.serialNo,{name:'bookmark_page'});
		port = chrome.extension.connect({name:'bookmark_page'});
	  	port.onMessage.addListener(function(msg) {
			switch(msg.message){
				case 'notify':
					notify(msg.value, msg.style);
					break;
				case 'refresh and scan':
					root.fetchBookmarks(function(list){fillBookmarks(list,true);});
					break;
				case 'refresh content':
					root.fetchBookmarks(function(list){fillBookmarks(list);});
					break;
				case 'scan':
					$('.scan-all').click();	
					break;
				case 'prepare done':
					//Get the url setting
					var curUrl = $('.right-panel').data('url');
					root.getSetBasedOnUrl(curUrl,function(config){
						//页面处理
						if(config==null){
							notify('解析失败,请检查配置。','new');
							root.curSearchDomain = root.getDomain(curUrl);
							chrome.tabs.create({url:"searchSite.html"});
						} else {
							if(config.post=='1'){
								notify('解析成功,开始处理:兼容模式，阅读过程中请保持原始页面不关闭，如意外关闭，请重新打开再次进行阅读操作。', 'new');
							} else {
								notify('解析成功,开始处理，请稍候...','new');
							}
							root.parsePage(curUrl,function(info){
								root.createNewPage(info);
							});
						}
					});
					break;
				default:
			}
		});

		$('.middle-panel-main').css('height',$('.middle-panel').height()-32);

		//Rating Plugin
		/*
		$('#rating').raty({
			hintList:['糟糕', '鸡肋', '不错', '好书', '神作'] ,
			path:'images/jquery.raty',
			half:true,
			start:2
		});
		*/
		// 预检查	
		root.checkBookmarkInstance(function(){
			if(root.dirId == null){
				root.initBookmark(function(){
				});
			}
		});

		//Fetch Bookmarks after checking;
		setTimeout(function(){root.fetchBookmarks(function(list){fillBookmarks(list,true);});},0);
	
		//禁止右键
		function blockContextmen(){
	　　　　if(window.event){
	　　　　　　window.event.returnValue=false;
	　　　　}
	　　}
　　	//document.oncontextmenu=blockContextmen;

		var middleStub = $("<div></div>");
		middleStub.load("http://rabbook.diandian.com .post.text:first", function(data){
			var realUrl="";
			realUrl = middleStub.find('a:first').attr('href');
			$('.middle-info .info-content').empty();
			$('.middle-info .info-content').append("<a href="+realUrl+" target=_blank></a>");
			$('.middle-info .info-content a').html(middleStub.find("a:first").text());
		});


		window.onresize=function(){
			$('.middle-panel-main').css('height',$('.middle-panel').height()-32);
		};

		if(localStorage.newBookmark=='true'){
			$('.arrowup').addClass('primary');
		} else {
			$('.arrowup').removeClass('primary');
		}

		//Tooltip
		$('.tofav').tooltip({
			animation:true
		});
		$('.tofav').click(function(){
			chrome.tabs.create({url:"https://chrome.google.com/webstore/detail/rabbook-%E5%B0%8F%E8%AF%B4%E9%98%85%E8%AF%BB%E5%99%A8/nndomihejeomoigdjeganklacijoolgg/reviews?utm_source=chrome-ntp-icon"});
		});
	});
	//binding
	$('.bookmark').on('click','.bookmarkTd.site',function(){
		openSite($(this).html());	
	});

	$('.bookmark').on('click','.bookmarkTd.name',function(){
		$('.bookmarkTr').removeClass('success');
		$(this).parent().addClass('success');
		refreshRightPanel($(this).parent());	
	});

	$('.bookmark').on('mousedown','.bookmarkTd.chapter',function(e){
	    if (e.which === 3) {
			var curUrl = $(this).data('url');
			chrome.tabs.create({url:curUrl});
	    }
	});

	$('.bookmark').on('click','.bookmarkTd.chapter',function(e){
		var curUrl = $(this).data('url');
		$('.right-panel').data('url',curUrl);
		//清空原来的页面缓存
		root.entryBusy = false;
		if(root.readerTab!=null){
			//root.readerTabPort.postMessage({message:'clear buffer'}); //为了防止个别情况下，清空动作发生在读入之后，导致有效内容被清空。
			chrome.tabs.remove(root.readerTab.id,function(tab){
				root.getSetBasedOnUrl(curUrl,function(config){
					//页面处理
					if(config==null){
						notify('解析失败,请检查配置。','new');
						root.curSearchDomain = root.getDomain(curUrl);
						chrome.tabs.create({url:"searchSite.html"});
					} else {
						if(config.post=='1'){
							notify('解析成功,开始处理:兼容模式，阅读过程中请保持原始页面不关闭，如意外关闭，请重新打开再次进行阅读操作。','new');
						} else {
							notify('解析成功,开始处理，请稍候...','new');
						}

						root.parsePage(curUrl,function(info){
							root.createNewPage(info);
						});
					}
				});
			});
		} else {
			root.getSetBasedOnUrl(curUrl,function(config){
				//页面处理
				if(config==null){
					notify('解析失败,请检查配置。','new');
					root.curSearchDomain = root.getDomain(curUrl);
					chrome.tabs.create({url:"searchSite.html"});
				} else {
					if(config.post=='1'){
						notify('解析成功,开始处理:兼容模式，阅读过程中请保持原始页面不关闭，如意外关闭，请重新打开再次进行阅读操作。','new');
					} else {
						notify('解析成功,开始处理，请稍候...','new');
					}


					root.parsePage(curUrl,function(info){
						root.createNewPage(info);
					});
				}
			});
		}
	});

	$('.recent-list').on('click','.book-name',function(){
		var curUrl = $(this).data('url');
		//Get the url setting
		root.getSetBasedOnUrl(curUrl,function(config){
			//页面处理
			if(config==null){
				notify('解析失败,请检查配置。','new');
				root.curSearchDomain = root.getDomain(curUrl);
				chrome.tabs.create({url:"searchSite.html"});
			} else {
				if(config.post=='1'){
					notify('解析成功,开始处理:兼容模式，阅读过程中请保持原始页面不关闭，如意外关闭，请重新打开再次进行阅读操作。','new');
				} else {
					notify('解析成功,开始处理，请稍候...','new');
				}
				root.parsePage(curUrl,function(info){
					root.createNewPage(info);
				});
			}
		});
	});


	$('#notify').hover(function(){
		$(this).hide();
	});

//	$('.profile-number.read-reset').click(function(){
		//if(confirm("确认重置历史统计？")){
			//$('.profile-number.read_done').html(0);
			//$('.profile-number.dropped').html(0);
	$('.recent-list').on('click','.read-reset',function(){
		if(confirm("确认重置最近阅读？")){
			root.localStorage.recentList = "[]";
			fillRecents();
			syncStat(true);
		}
	});

	$('.global-operation .scan-all').click(function(){
		 root.updateSandbox = {}; //Clear all history
		 $('.bookmarkTr').each(function(index){
		 		var newStub = $('<div></div>');
				setTimeout(function(){checkBookmarkUpdate($('.bookmarkTr').eq(index),newStub,index);}, index*100); //防止conflict
		});
	});

	$('.arrowup').click(function(){
		if($('.loader-span').hasClass('run')) {
			return false;	
		}
		if(root.oauth.hasToken()) {
			uploadBookmarkFile('kuaipan');
		} else {
			notify('未连接云存储， 请先往设置页面进行认证');
			justAuth('kuaipan');
		}
	});

	$('.arrowdown').click(function(){
		if($('.loader-span').hasClass('run')) {
			return false;	
		}
		if(root.oauth.hasToken()) {
			downBookmarkFile('kuaipan');
		} else {
			notify('未连接云存储， 请先往设置页面进行认证');
			justAuth('kuaipan');
		}
	});



}
function syncStatus(){
	$('.loader-span').removeClass('run').addClass('stop');
	$('.arrowup').removeClass('primary');
	root.localStorage.newBookmark = false;
}

function optScroll(destroy){
		//$('.middle-panel').mCustomScrollbar('destroy');
		$('.left-panel').mCustomScrollbar('destroy');
		//scroll
		//$('.middle-panel').mCustomScrollbar({
//			mousewheel:true,
//	        scrollButtons:{
//	          enable:false
//		    },
//			theme:'dark-2'
//		});
		$('.left-panel').mCustomScrollbar({
			mousewheel:true,
	        scrollButtons:{
	          enable:false
		    },
			theme:'dark-thin'
		});



}

