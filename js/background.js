//Entry Tab
var curVersion="3.5.4.2";
var updateStep = 'small';
var customSitesLegacy={sites:[]};
var onlinebase = "http://rabbook.diandian.com";
var onlineindex = "http://rabbook.diandian.com/post/2012-11-21/40042160832";

var curCharset = null;
var charsetTries = 0;
//var serialNo = "nndomihejeomoigdjeganklacijoolgg";
//var serialNo = "fgijfppdmphfngnjchdcockmaekdlnji";

 /*        "request_url" {String} OAuth request token URL.
 *         "authorize_url" {String} OAuth authorize token URL.
 *         "access_url" {String} OAuth access token URL.
 *         "consumer_key" {String} OAuth consumer key.
 *         "consumer_secret" {String} OAuth consumer secret.
 *         "scope" {String} OAuth access scope.
 *         "app_name" {String} Application name.
 *         "auth_params" {Object} Additional parameters to pass to the
 */


 
//var oauths = {	
///*
//				"qq":ChromeExOAuth.initBackgroundPage({
//  					'request_url': 'https://open.t.qq.com/cgi-bin/request_token',
//				  	'authorize_url': 'https://open.t.qq.com/cgi-bin/authorize',
//					'access_url': 'https://open.t.qq.com/cgi-bin/access_token',
//					'consumer_key': '26ce9247902447afa72b45f0d760dcaf',
//				    'consumer_secret': '20dea66857d93a32fb566deea73bde66',
//					'scope': 'http://t.qq.com/',
//					'app_name':'Tmix' 
//				}),
//		*/
//				"kuaipan":ChromeExOAuth.initBackgroundPage({
//  					'request_url': 'https://openapi.kuaipan.cn/open/requestToken',
//				  	'authorize_url': 'https://www.kuaipan.cn/api.php',
//					'access_url': 'https://openapi.kuaipan.cn/open/accessToken',
//					'consumer_key': 'xchxPcknDPFDRTDS',
//				    'consumer_secret': 'zDNhj4P3mS6hSsJW',
//					'scope': 'http://www.kuaipan.cn/',
//					'app_name':'Rabbook' ,
//					'auth_params':{
//						'ac':'open',
//						'op':'authorise'
//					}
//				}),
//			};



var	weiboAuth = new OAuth2('weibo', {
  	client_id: '2294087980',
  	client_secret: '8d956ee3038aa98a13bd5a4fb8ad735f',
	api_scope: 'follow_app_official_microblog'
});

var	obcAuth = new OAuth2('obc', {
	client_id:'OAL@51CC3771BD8C1',
  	client_secret: 'c984aed014aec7623a54f0591da07a85fd4b762d',
	api_scope: 'rabbook_obc'
});


var oauth = ChromeExOAuth.initBackgroundPage({
  					'request_url': 'https://openapi.kuaipan.cn/open/requestToken',
				  	'authorize_url': 'https://www.kuaipan.cn/api.php',
					'access_url': 'https://openapi.kuaipan.cn/open/accessToken',
					'consumer_key': 'xchxPcknDPFDRTDS',
				    'consumer_secret': 'zDNhj4P3mS6hSsJW',
					'scope': 'http://www.kuaipan.cn/',
					'app_name':'Rabbook' ,
					'auth_params':{
						'ac':'open',
						'op':'authorise'
					}
});


var fs = null; //file handler			
var syncing = false;// if it's in sync or not


var curPageInfo;

var entryTab = null; //入口按钮点下时的页面
var entryTabPort = null;
var entryBusy=false;
var entryData=null;
var readerTab = null; //阅读页面
var readerTabPort = null;
var bookMarkTab = null; //阅读页面
var bookMarkTabPort= null;

var curSiteConfig=null;//当前应用的站点配置
var ajaxHdl;
var xmlHandler = new XMLHttpRequest();	//Special for GBK sites;

var fakeStub = $("<div></div>"); //解析的容器
var stub = $("<div></div>"); //解析的容器

var rbk_fs=null;

var curUrl= null;
var curBase= null;

var busy = false;
var bookmarkbusy = false;
var refreshFlag=0;

var sandboxResult = null;
var updateSandbox = {};

var fileBuffer=null;

var dirId = null;


//For SiteConfig Setting:
var siteTitle 	= null;
var siteUrl 	= null;


localStorage.newBookmark = true;
if(!localStorage['cur_version']) {
		//DB Initialize
		initLocalDb(true,true);
		localStorage.cur_version = curVersion;
		localStorage.newBookmark = true;
		updateInfo('big');
		//Totally new, and then load the remote recommended sites by default;
		loadConfig();
} else if( localStorage.cur_version != curVersion ) {
		//DB Initialize
		initLocalDb(false,true);
		localStorage.cur_version = curVersion;
		updateInfo(updateStep);
		loadConfig();
} else if(localStorage['sites_setting_customize']) {
		//DB Initialize
		initLocalDb(false,false);
		//Test Code
		//localStorage.sites_setting_customize = JSON.stringify({"sites":[{"configName":"猫扑","regPageOrg":"^http://www.mpzw.com/html/\\S*.html","textTag":"div","textAttr":"class","textID":"content","menuTag":"NA","menuAttr":"NA","menuID":"page","matchPre":"上一","matchNext":"下一","matchMenu":"全文阅读","titleRegStr":"(.*?),(.*?)-","titleLocation":"0","contentScript":false,"patchType":"none"},{"configName":"读小说","regPageOrg":"^http://www.doxiaoshuo.com/html/\\S*.html","textTag":"div","textAttr":"id","textID":"content","menuTag":"div","menuAttr":"id","menuID":"thumb","matchPre":"上一","matchNext":"下一","matchMenu":"目 录","titleRegStr":"(.*?)_(.*?)-.*","titleLocation":"0","contentScript":false,"patchType":"none"},{"configName":"吾爱","regPageOrg":"^http://www.xs52.com/xiaoshuo/\\S*.html","textTag":"div","textAttr":"id","textID":"text_area","menuTag":"div","menuAttr":"id","menuID":"chapter_pager","matchPre":"上一章","matchNext":"下一章","matchMenu":"回目录","titleRegStr":"(.*?)最新章节_(.*?)-.*","titleLocation":"0","contentScript":false,"patchType":"none"},{"configName":"易读","regPageOrg":"^http://www.yi-look.com/\\S*.html","textTag":"td","textAttr":"class","textID":"ART","menuTag":"NA","menuAttr":"NA","menuID":"NA","matchPre":"上一节","matchNext":"下一节","matchMenu":"目录","titleRegStr":"《(.*?)》 (.*?) 易读","titleLocation":"0","contentScript":false,"patchType":"none"},{"configName":"手打吧","regPageOrg":"http://www.shouda8.com/\\S*.htm","textTag":"div","textAttr":"id","textID":"chapter_content","menuTag":"div","menuAttr":"id","menuID":"page_bar","matchPre":"上一章","matchNext":"下一章","matchMenu":"回目录","titleRegStr":"(.*?) (.*?)-.*","titleLocation":"0","contentScript":false,"patchType":"none"},{"configName":"站点名称","regPageOrg":"^http://www.xkzw.org/xkzw\\S*.html","textTag":"div","textAttr":"id","textID":"booktext","menuTag":"div","menuAttr":"class","menuID":"book_middle_text_next","matchPre":"上一章","matchNext":"下一章","matchMenu":"回书目","titleRegStr":"(.*?) (.*?)","titleLocation":"0","contentScript":false,"patchType":"none"},{"configName":"闪文","regPageOrg":"http://read.shanwen.com/\\S*.htm","textTag":"div","textAttr":"id","textID":"content","menuTag":"NA","menuAttr":"NA","menuID":"NA","matchPre":"上一","matchNext":"下一","matchMenu":"回目录","titleRegStr":"(.*?)最新章节-(.*?)-.*","titleLocation":"0","contentScript":false,"patchType":"none"},{"configName":"biquge","regPageOrg":"^http://www.biquge.com/\\S*.html","textTag":"div","textAttr":"id","textID":"content","menuTag":"div","menuAttr":"class","menuID":"bottem","matchPre":"上一章","matchNext":"下一章","matchMenu":"目录","titleRegStr":"(.*?)_(.*?)_.*","titleLocation":"1","contentScript":false,"patchType":"none"},{"configName":"云轩阁","regPageOrg":"^http://www.yxgxsw.com/\\S*.html","textTag":"div","textAttr":"id","textID":"content","menuTag":"NA","menuAttr":"NA","menuID":"NA","matchPre":"翻上页","matchNext":"翻下页","matchMenu":"回目录","titleRegStr":"(.*)全文:(.*)","titleLocation":"0","contentScript":false,"patchType":"none"},{"configName":"博看","regPageOrg":"http://www.bokon.net/\\S+/\\S+/\\S+.html","textTag":"div","textAttr":"id","textID":"DivContent","menuTag":"a","menuAttr":"class","menuID":"PagesLink","matchPre":"上一页","matchNext":"下一页","matchMenu":"回目录","titleRegStr":"(.*?) (.*?)","titleLocation":"0","contentScript":false,"patchType":"none"}]});
		customSitesLegacy = JSON.parse(localStorage.sites_setting_customize);
} else {
		initLocalDb(false,false);
}


//绑定Msg处理
backgroundMsgBinding();
//初始化目录
// 预检查	
checkBookmarkInstance(function(){
	if(dirId == null){
		initBookmark(function(){
		});
	}
});


