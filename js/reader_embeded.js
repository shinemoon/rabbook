var insharing = false; //sharing, to disable shortcut;
var sharecopy = "";
var intervalHdl = -1;
var intervalHdlPointer = -1;
var tabName = 'reader-tab';
var port;
var animateScrollTime = 500;

var ttson = false;
var prePage= {
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

var nextPage= {
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

var root = chrome.extension.getBackgroundPage();


//初始字体大小
if(typeof(root.localStorage.fontSize)=='undefined'){
	root.localStorage.fontSize = 14;
}

//阅读模式
if(typeof(root.localStorage.readMode)=='undefined'){
	root.localStorage.readMode = 'default';
}

//初始滚屏速度
if(typeof(root.localStorage.scrollSpeed)=='undefined'){
	root.localStorage.scrollSpeed = 30;
}


var fontSize = root.localStorage.fontSize;
var readMode = root.localStorage.readMode;
var scrollSpeed = root.localStorage.scrollSpeed;
//初始皮肤选择

var cfg = JSON.parse(root.localStorage.generalReaderSetting);
var skincfg = JSON.parse(root.localStorage.generalSkinSetting);






setTimeout(function(){readerInit();},1);
function readerInit(){
	if(skincfg.skin == 'customize' && skincfg.customize == ""){
		alert('自定义皮肤未定义之前，不允许选择自定义！');
		skincfg.skin = 'default';
		root.localStorage.generalSkinSetting = JSON.stringify(skincfg); 
		selectCssFile('#reader-style','reader-default.css');
	} else {
		selectCssFile('#reader-style','reader-'+skincfg.skin+'.css');
	}


	$(document).ready(function(){

		chrome.tts.stop();
		$('#play-tts').removeClass('btn-success');
		//port = chrome.extension.connect(root.serialNo,{name:'reader_page'});
		port = chrome.extension.connect({name:'reader_page'});
	  	port.onMessage.addListener(function(msg) {
			switch(msg.message){
				case 'notify':
					notify(msg.value, msg.style);
					break;
				case 'refresh content':
					curPage = root.curPageInfo;
					fillPage(curPage,true);
					$('body').show();	//避免先刷出未渲染内容
					root.parsePage(curPage.curNext,function(info){
						nextPage = info;
					});
					break;
				case 'clear buffer':
					prePage= {
						curSite:'',curTitle:'',curBook:'',curChapter:'',curContent:'',curUrl:'',curMenu:'',curNext:'',curPre:''
					};
					curPage = {
						curSite:'',curTitle:'',curBook:'',curChapter:'',curContent:'',curUrl:'',curMenu:'',curNext:'',curPre:''
					};
					nextPage= {
						curSite:'',curTitle:'',curBook:'',curChapter:'',curContent:'',curUrl:'',curMenu:'',curNext:'',curPre:''
					};
					port.postMessage({message:'prepare done'});
					break;
				default:
			}
		});

		//binding
		$('#control-panel-stub').hover(function(){
			$('#control-panel').show('slow',function(){
					$('body').bind('mousemove',function(e){
						if(e.pageX<100) return; //To workaround possible issue in chrome;
						if(e.pageX < $(document).width()-$('#control-panel').width()-Number(50)){
							$('body').unbind('mousemove');
							$('#control-panel').hide();
						}
				});
			});
		});

		$('#navigation-add').click(function(){
			root.addBookmark(curPage);
		});
	
		$('#navigation-pre').click(function(){
			fetchPre();
		});
		$('#navigation-menu').click(function(){
			chrome.tabs.create({url:curPage.curMenu});
		});
		$('#navigation-next').click(function(){
			fetchNext(true);
		});
		$('#navigation-bbs').click(function(){
			chrome.tabs.create({url:'http://tieba.baidu.com/rabbook'});
		});

		$('#notify').hover(function(){
			if($(this).hasClass('permanent')){
			} else {
				$(this).hide();
			}
		});

		$('#font-dec').click(function(){
			fontSize = Number(fontSize)-Number(1);
			$('.content').css('font-size',fontSize + 'px');
			root.localStorage.fontSize = fontSize;

		});

		$('#font-inc').click(function(){
			fontSize = Number(fontSize)+Number(1);
			$('.content').css('font-size',fontSize + 'px');
			root.localStorage.fontSize = fontSize;
		});

		$('#play-tts').click(function(){
			if($(this).hasClass('btn-success')) {
				$(this).removeClass('btn-success');
				chrome.tts.stop();
				root.innerShow('语音读书停止!','new');
			} else {
				$(this).addClass('btn-success');
				root.innerShow('语音读书中','permanent');
				while($('.content').length>1) {
					$('.chapter-head:first').remove();
					$('.content:first').remove();
				}
			    $('body').animate({scrollTop:0},animateScrollTime);
				startTTS();
			};
		});

		$('#play-ff').click(function(){
			scrollSpeed = Number(scrollSpeed)+Number(5);
			if(scrollSpeed > 100) {
				scrollSpeed = 100;	
			}
			$('#speednotify').html(scrollSpeed);
			$('#speednotify').show();
			//AutoScroll Init
			$('body').autoscroll('destroy');
			if(cfg.autoscroll=="scrolldown"){
				$('body').autoscroll({ 
					    direction: "down", 
					    step: scrollSpeed, 
					    scroll: true 
				});
			} else {
				$('#speedpointer').show();
				$('#speedpointer-active').show();
				//定时器
				window.clearInterval(intervalHdl);
				intervalHdl = setInterval(function(){
									//scrollBy(0,document.body.clientHeight-20);
									$('body').animate({scrollTop:($('body').scrollTop() + document.body.clientHeight-20)},animateScrollTime);
									movePointer('start');
								}, (105-scrollSpeed)*280);
				window.clearInterval(intervalHdlPointer);
				intervalHdlPointer = setInterval(function(){
									movePointer();
								}, (105-scrollSpeed)*2.3);

			}
			root.localStorage.scrollSpeed = scrollSpeed;
			$("#play-pause i").removeClass('icon-play').addClass('icon-pause');

		});



		$('#play-pause').click(function(){
			if($(this).find('i').hasClass('icon-pause')){
				$("#play-pause i").removeClass('icon-pause').addClass('icon-play');
				$('body').autoscroll('destroy');
				window.clearInterval(intervalHdl);
				window.clearInterval(intervalHdlPointer);
				movePointer('stop');
				$('#speednotify').hide();
				$('#speedpointer').hide();
				$('#speedpointer-active').hide();
			} else {
				$('#speednotify').show();
				$("#play-pause i").removeClass('icon-play').addClass('icon-pause');
				if(cfg.autoscroll=="scrolldown"){
					//AutoScroll Init
					$('body').autoscroll({ 
						    direction: "down", 
						    step: scrollSpeed, 
						    scroll: true 
					});
				} else {
					$('#speedpointer').show();
					$('#speedpointer-active').show();
					//定时器
					window.clearInterval(intervalHdl);
					intervalHdl = setInterval(function(){
						//scrollBy(0,document.body.clientHeight-20);
						//$('body').scrollTop($('body').scrollTop() + document.body.clientHeight-20);
						$('body').animate({scrollTop:($('body').scrollTop() + document.body.clientHeight-20)},animateScrollTime);
						movePointer('start');
						}, (105-scrollSpeed)*280);
					window.clearInterval(intervalHdlPointer);
					intervalHdlPointer = setInterval(function(){
										movePointer();
									}, (105-scrollSpeed)*2.3);

				}
			}
		});

		$('#play-rew').click(function(){
			scrollSpeed = Number(scrollSpeed)-Number(5);
			if(scrollSpeed <= 0) {
				scrollSpeed = 5;	
			}
			$('#speednotify').html(scrollSpeed);
			$('#speednotify').show();
			//AutoScroll Init
			$('body').autoscroll('destroy');
			if(cfg.autoscroll=="scrolldown"){
				$('body').autoscroll({ 
					    direction: "down", 
					    step: scrollSpeed, 
					    scroll: true 
				});
			} else {
				$('#speedpointer').show();
				$('#speedpointer-active').show();
				//定时器
				window.clearInterval(intervalHdl);
				intervalHdl = setInterval(function(){
						//scrollBy(0,document.body.clientHeight-20);
						//$('body').scrollTop($('body').scrollTop() + document.body.clientHeight-20);
						$('body').animate({scrollTop:($('body').scrollTop() + document.body.clientHeight-20)},animateScrollTime);
						movePointer('start');
				}, (105-scrollSpeed)*280);
				window.clearInterval(intervalHdlPointer);
				intervalHdlPointer = setInterval(function(){
									movePointer();
								}, (105-scrollSpeed)*2.3);


			}
			root.localStorage.scrollSpeed = scrollSpeed;
			$("#play-pause i").removeClass('icon-play').addClass('icon-pause');
		});


		$(window).scroll(function(){
			if(cfg.autopage){
				if($('body').scrollTop() >= ($('#wrapper').height() - 3*$(window).height())){
					if($('.content').length > 0 ){
						fetchNext(false);
					}
				}
			}
		});


		//快捷键
		document.onkeydown=function(evt) {
			//前后翻页
			//Normal Set
			if(insharing) return;
			if(cfg.shortkeystyle == 'normal') { //箭头翻页
					switch(evt.keyCode){
					case 84: //tts key
						$('#play-tts').click();
						break;
					case 32: //space
					case 34: //page down
						if(cfg.autopage){
							setTimeout(function(){if($('body').scrollTop() >= $('#wrapper').height()-2*$(window).height()) fetchNext(false);},100);
						}
						break;
					case 39: //->
						$('span.btn-next').click();
						break;
					case 37: //<-
						$('span.btn-pre').click();
						break;
					case 83: //s
						$('#play-pause').click();
						break;
					case 13: //enter
						chrome.tabs.create({url:curPage.curUrl});
						break;
					case 65: //a
						$('span.btn-add').click();
						break;
					default:
				}
			} else if (cfg.shortkeystyle == 'vim'){//j,k 翻页;g 回页首;s 滚屏切换
				switch(evt.keyCode){
					case 84: //tts key
						$('#play-tts').click();
						break;
					case 76: //l
						$('span.btn-next').click();
						break;
					case 72: //h
						$('span.btn-pre').click();
						break;
					case 74: //j
						scrollBy(0,document.body.clientHeight-20);
					case 32: //space
					case 34: //page down
						if(cfg.autopage){
							setTimeout(function(){if($('body').scrollTop() >= $('#wrapper').height()-2*$(window).height()) fetchNext(false);},100);
						}
						break;
					case 75: //k
						scrollBy(0,-document.body.clientHeight+20);
						break;
					case 71:  //g
						scrollTo(0,0);
						break;
					case 83: //s
						$('#play-pause').click();
						break;
					case 13: //enter
						chrome.tabs.create({url:curPage.curUrl});
						break;
					case 65: //a
						$('span.btn-add').click();
						break;
					default:
				}
			}
		};
		$('#speednotify').html(scrollSpeed);


		//滚轮到边判断
		function handle(delta) {
		    if (delta <0) {
				if(cfg.autopage){
					if($('body').scrollTop() >= ($('#wrapper').height() - 3*$(window).height())){
						if($('.content').length > 0 ){
							fetchNext(false);
						}
					}
				}
			}
		}//from www.fengfly.com
		function wheel(event){
		    var delta = 0;
		    if (!event) event = window.event;
		    if (event.wheelDelta) {
		        delta = event.wheelDelta/120; 
		        if (window.opera) delta = -delta;
		    } else if (event.detail) {
		        delta = -event.detail/3;
		    }
		    if (delta)
		        handle(delta);
		}
		if (window.addEventListener)
		window.addEventListener('DOMMouseScroll', wheel, false);
		document.onmousewheel = wheel;

		//Skin display
		for(var i=0; i<root.skins.length;i++){
			$('#cur-skin').append("<option value='"+root.skins[i].name+"'>"+root.skins[i].display+"</option>");
			if(root.skins[i].name==skincfg.skin){
				$('#cur-skin option:last').attr("selected","selected");
			}
		}
		$('#cur-skin').bind("change",function(){
			var selSkin = $('#cur-skin option:selected').val();
			if(selSkin == 'customize') {
				if(skincfg.customize=="") {
					alert("切换之前，请先正确配置自定义皮肤!");
					$('#cur-skin').val('default');
					skincfg.skin = 'default';
					root.localStorage.generalSkinSetting = JSON.stringify(skincfg); 
					selectCssFile('#reader-style','reader-default.css');
				} else {
					skincfg.skin = selSkin;
					root.localStorage.generalSkinSetting = JSON.stringify(skincfg); 
					selectCssFile('#reader-style','reader-'+skincfg.skin+'.css');
				}
			} else {
				skincfg.skin = selSkin;
				root.localStorage.generalSkinSetting = JSON.stringify(skincfg); 
				selectCssFile('#reader-style','reader-'+skincfg.skin+'.css');
			}
		});

	//touch mode 
		var gesturesX = 0;
		var gesturesY = 0;
		
		var startPosition = 0;
		var startXPosition = 0;
		var velocity = 0;
		var xmove = 0;
		var isMouseDown = false;
		var isMouseMoved = false;
		
		var timer = 0;
		
		function pressTimer(){
			if(isMouseMoved) {
				timer = 0;
				return false;
			};
			if(isMouseDown && timer < 5) {
				if(++timer==5) {
					if($('body').hasClass('touchy')){
						notify('进入可选择模式，再次长按进行切换','new');
						$('body').removeClass('touchy');
						readMode = 'default';
					} else {
						if(root.localStorage.readMode == 'touch') {
							notify('进入非选择模式，再次长按进行切换','new');
							$('body').addClass('touchy');
							readMode = 'touch';
						}
					}
				}; 
				setTimeout(function(){
					pressTimer();
				}, 1000);
			} else {
				timer = 0;
			}
		}

		function GetVelocity() {
		    velocity = startPosition - gesturesY;
		}
		function GetXmove() {
		    xmove = startXPosition - gesturesX;
		}
		
		$(document).mousemove( function (e) {
			isMouseMoved = true;
	        return false;
		});
		
		$(document).mousedown( function(e) {
			if(e.button!=0) return;
			sharecopy = window.getSelection().toString();
			window.getSelection().removeAllRanges();
		    startPosition = e.pageY;
		    startXPosition = e.pageX;
		    isMouseDown = true;
			isMouseMoved = false;
			pressTimer();
		});
		
		$(document).mouseup( function(e) {
			timer = 0;
		    isMouseDown = false;
		    gesturesX = e.pageX;
		    gesturesY = e.pageY;
		    GetVelocity();
			GetXmove();
			if(readMode=='touch'){
		    	if (xmove > 0) {
			        xmove = 0;
					fetchNext(true);
			    } else if (xmove <0 ) {
			        xmove = 0;
					fetchPre(true);
				}
			} else { //touch mode done
				//处理分享
				if($('#imgSinaShare').css("display") != "none") {
					setTimeout(function(){$('#imgSinaShare').hide('slide');}, 0);
				} else {
					if(typeof(cfg.enableWeibo)=='undefined'){
						cfg.enableWeibo = 'enabled';
						root.localStorage.generalReaderSetting = JSON.stringify(cfg);
					}

					if(cfg.enableWeibo == 'enabled') {
						setTimeout(function(){
							if(window.getSelection().toString()!=""){
								$('#imgSinaShare').css("position","fixed");
								$('#imgSinaShare').css("left",e.clientX+5);
								$('#imgSinaShare').css("top",e.clientY+0);
								$('#imgSinaShare').show('slide');
							}
						},0);
					}
				}

			}		    
			return false;
		});


	//新增点击翻页
	var cfg = JSON.parse(root.localStorage.generalReaderSetting);
//	if(typeof(cfg.clickpage)=='undefined') cfg.clickpage = "enable";
	//if(cfg.clickpage=="enable" || readMode == "touch") {
	if(readMode == "touch") {
		$('body').bind('click',function(e){
			if(xmove > 10 || xmove < -10 || readMode =='default') return false;
			if(e.clientY > $(window).height()*2/3) {
				scrollBy(0,document.body.clientHeight-20);
			} else if(e.clientY < $(window).height()/3){
				scrollBy(0,-document.body.clientHeight+20);
			}
		});
	}

	});

	$('#imgSinaShare').click(function(){
		$('#imgSinaShare').hide();
		//action here
		if(root.weiboAuth.hasAccessToken()){
			insharing = true;
			$('.sharemask').show();
			$('#sharepanel').show();

			$('#shareinput').val(sharecopy.replace(/\s*\n\s*/ig, ' ') + "…" + "#RABBOOK#" + "#" + curPage.curBook + "#");
			countChar();
			//CheckBox
			$('.rabbook-tag input').get(0).checked = true;
			$('.book-tag input').get(0).checked=true;
			$('.link-addr input').get(0).checked=false;




			//Test Update:
//			$.post("https://api.weibo.com/2/statuses/update.json", 
//				{
//					'access_token':root.weiboAuth.getAccessToken(),
//					'status':	"风雨大作"
//				},
//				function(data){
//					console.log(data);
//			});
		} else {
			root.weiboAuth.authorize(function() {
		    	// Ready for action
				//读取用户
				$.get("https://api.weibo.com/2/users/show.json?access_token=" + root.weiboAuth.getAccessToken() + "&uid=" + root.weiboAuth.get('uid'), function(result){
					chrome.storage.local.set({'weiboname':result.name});
					notify('连接完毕','new');
				});
		  	});
		}
	});

	$('.label.share').click(function(){
		if($('#shareinput').val().length>140){
			alert('信息过长，无法发送!');
		} else {
			$('#sharepanel').hide();
			$('.sharemask').hide();
			notify("微博发送中","new");
			$.post("https://api.weibo.com/2/statuses/update.json", 
				{
					'access_token':root.weiboAuth.getAccessToken(),
					'status':	$('#shareinput').val()
				},
				function(data){
					var res = data;
					if(typeof(res.created_at)!='undefined'){
						notify("微博发送成功","new");
					} else {
						notify("微博发送不成功","new");
					}
					$('#shareinput').val('');
			});
		}
	});

	$('.sharemask').click(function(){
		$('#sharepanel').hide();
		$('.sharemask').hide();
	});


	$('#shareinput').keydown(function(){
		countChar();
	});

	$('#shareinput').keydown(function(){
		countChar();
	});

	$('.rabbook-tag input').click(function(){
		if($('.rabbook-tag input').get(0).checked){
			if($('#shareinput').val().match(/#RABBOOK#/) == null) {
				$('#shareinput').val($('#shareinput').val() + '#RABBOOK#');
			} else {
			}
		} else {
			if($('#shareinput').val().match(/#RABBOOK#/) == null) {
			} else {
				$('#shareinput').val($('#shareinput').val().replace(/#RABBOOK#/ig,''));
			}
		}
		countChar();
	})
	$('.book-tag input').click(function(){
		var booktag = "#"+curPage.curBook+"#";
		var msg = {
			command:'do regular exp',
			parameters: { 'list': [
				{'name':'regexp', 'value':'/'+booktag+'/'},
				{'name':'target', 'value':$('#shareinput').val()}
			], 'evalScript':""}
		};
		root.sandBoxProceed(msg);
		//因为沙箱操作(至少针对eval)
		function waitforContentSandBox()
		{   
		   if(root.sandboxResult==null) {
		   		setTimeout(function(){
						waitforContentSandBox();
				},20);
		   	} else {
				if($('.book-tag input').get(0).checked){
					if(root.sandboxResult == 'NA') {
						$('#shareinput').val($('#shareinput').val() + booktag);
						countChar();
						root.sandboxResult=null;
					} else {
						root.sandboxResult=null;
					}
				} else {
					if(root.sandboxResult == 'NA') {
						root.sandboxResult = null;
					} else {
						root.sandboxResult = null;
						msg = {
							command:'do regular replace',
							parameters: { 'list': [
								{'name':'regexp', 'value':'/'+booktag+'/ig, ""'},
								{'name':'target', 'value':$('#shareinput').val()}
							], 'evalScript':""}
						};
						root.sandBoxProceed(msg);
						function waitforReplaceSandBox()
						{   
						   if(root.sandboxResult==null) {
						   		setTimeout(function(){
										waitforReplaceSandBox();
								},20);
						   	} else {
								$('#shareinput').val(root.sandboxResult);
								countChar();
								root.sandboxResult = null;
							}
						}
						waitforReplaceSandBox();
					}
				}
			}
		}
		waitforContentSandBox();
	});

	$('.link-addr input').removeAttr('checked');	


	$('.link-addr input').click(function(){
		if($('.link-addr input').get(0).checked){
			var linkaddr = "https://api.weibo.com/2/short_url/shorten.json?access_token=" + root.weiboAuth.getAccessToken() +"&url_long=" + curPage.curUrl;

			root.xmlHandler.onreadystatechange = function () {
			 	if(root.xmlHandler.readyState == 4 && root.xmlHandler.status == 200) {
					content = JSON.parse(root.xmlHandler.responseText);
					if($('#shareinput').val().match(/http[s]{0,1}:\/\//) == null) {
						$('#shareinput').val($('#shareinput').val() + content.urls[0].url_short);
					}
					$('.link-addr input').show();
					$('#short-link-loader').hide();
					countChar();
				} else if(root.xmlHandler.readyState == 4 && root.xmlHandler.status != 200) {
					$('.link-addr input').show();
					$('#short-link-loader').hide();
					countChar();
				}	
			};
			root.xmlHandler.open('GET', linkaddr, true);
			root.xmlHandler.send();
			$('.link-addr input').hide();
			$('#short-link-loader').show();

		} else {
			if($('#shareinput').val().match(/http[s]{0,1}:\/\//) == null) {
			} else {
				$('#shareinput').val($('#shareinput').val().replace(/http[s]{0,1}:\/\/\S*\s?/ig, ''));
				countChar();
			}
		}
	});

	//Clock Handle
	if(cfg.clockshow=="true"){
		$('#clockshow').show();
	} else {
		$('#clockshow').hide();
	}
	var today = new Date();
	var chour = today.getHours();
	var cmin = today.getMinutes();
	if(chour<10) chour = "0" + chour;
	if(cmin<10) cmin = "0" + cmin;
	$('#clockshow').html( chour + ": " + cmin);
	//Set TimeInterval
	setInterval(function(){
		var cuhour = today.getHours();
		var cumin = today.getMinutes();
		if(cuhour<10) cuhour = "0" + cuhour;
		if(cumin<10) cumin = "0" + cumin;
		today = new Date();
		$('#clockshow').html( cuhour + ": " + cumin);
	},60000);
	//Check the font-setting
	if(typeof(localStorage.autofont)=='undefined') {
		$('#auto-font input').prop('checked', false);
		localStorage.autofont = true;
	} else {
		$('#auto-font input').prop('checked', ((localStorage.autofont=='true')?true:false));
	}
	//Font Decision
	if(typeof(localStorage.autofont)!='undefined' && localStorage.autofont=="true") {
		//Judge OS
		//if not in windows, use Songti + Kaiti,for others, use the own themes setting
		if($.client.os!='Windows'){
			$('head').append("<style type='text/css' class='autofont'>.chapter-head {font-family:Kai, Kaiti SC, KaiTi, BiauKai, 楷体!important;}</style>")
			$('head').append("<style type='text/css' class='autofont'>.content {font-family:Georgia,Times,Songti SC,SimSun,serif!important;}</style>")
		}
	} else {
		$('style.autofont').remove();
	}
	$('#auto-font input').click(function(){
		localStorage.autofont = $(this).prop('checked');
		if(localStorage.autofont=="true") {
		//Judge OS
		//if not in windows, use Songti + Kaiti,for others, use the own themes setting
			if($.client.os!='Windows'){
				$('head').append("<style type='text/css' class='autofont'>.chapter-head {font-family:Kai, Kaiti SC, KaiTi, BiauKai, 楷体!important;}</style>")
				$('head').append("<style type='text/css' class='autofont'>.content {font-family:Georgia,Times,Songti SC,SimSun,serif!important;}</style>")
			}
		} else {
			$('style.autofont').remove();
		}
	});

	//Check the replace-setting
	if(typeof(localStorage.autoreplace)=='undefined') {
		$('#auto-replace input').prop('checked', false);
		localStorage.autoreplace = true;
	} else {
		$('#auto-replace input').prop('checked', ((localStorage.autoreplace=='true')?true:false));
	}
	$('#auto-replace input').click(function(){
		console.log ($(this).prop('checked'));

		localStorage.autoreplace = $(this).prop('checked');
	});

	//Check the ts-setting
	$('#ts-setting .btn').removeClass('btn-success');
	if(typeof(localStorage.ts)=='undefined') {
		localStorage.ts = 'nont';
	} else {
		$('#'+localStorage.ts).addClass('btn-success');
	}

	//Trans Decision
	$('#ts-setting .btn').click(function(){
		localStorage.ts = $(this).prop('id');
		$('#ts-setting .btn').removeClass('btn-success');
		$(this).addClass('btn-success');
		//refresh current chapter
		root.innerShow('繁简转换设置完成，翻页或刷新生效','new');
	});


}

function countChar()
{  
	var rest = 140 - $('#shareinput').val().length;
	if(rest<0) 
		$('.byte-count span').css('color','red');
	else 
		$('.byte-count span').css('color','lightblue');
	if(rest<-999) 
		rest = "----";
	$('.byte-count span').text(rest);
}  

function movePointer(str) {
	if(typeof(str)=='undefined') {
		str = 'continue';
	}
	if(str == 'continue') {
		//var curPos = $('#speedpointer-active').css('width').replace(/.*?(\d+).*/, '$1');
		var curPos = $('#speedpointer-active').css('height').replace(/.*?(\d+).*/, '$1');
		//var step = document.body.clientWidth/135;
		var step = document.body.clientHeight/128;
//		$('#speedpointer-active').css('width', (Number(curPos) + Number(step)));
		$('#speedpointer-active').css('height', (Number(curPos) + Number(step)));
	} else if(str == 'start') {
		//$('#speedpointer-active').css('width', "35px");
		$('#speedpointer-active').css('height', "0px");
	} else {
		//$('#speedpointer-active').css('width', '35px');
		$('#speedpointer-active').css('height', '0px');
	}
}

function startTTS(){
	//title
	chrome.tts.speak(
		$('.chapter-head:last').text(),
		{
			'rate':0.9,
			'pitch':0.3,
			onEvent: function(event) {
				if (event.type == 'end') {
					//content
					chrome.tts.speak(
						$('.content:last').text(),
						{
							'pitch':0.8,
							onEvent: function(event) {
						        //console.log('Event ' + event.type + ' at position ' + event.charIndex);
								if (event.type == 'end') {
									console.log('hit the end, try next page');
									//Go next page 
									fetchNext(true,true);
						        }
						        if (event.type == 'error') {
						          console.log('Error: ' + event.errorMessage);
						        }
						      }
					    }
					);
		        }
		        if (event.type == 'error') {
		          console.log('Error: ' + event.errorMessage);
		        }
		      }

	    }
	);
}

function stopTTS(){
	chrome.tts.stop();
	$('#play-tts').removeClass('btn-success');
	root.innerShow('语音读书停止!','new');
}

