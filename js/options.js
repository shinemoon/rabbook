var curStatus;
//阅读页面设置
function refreshReaderConfig(){
	curStatus = 'readerConfig';
	$('#sub-items').hide();
	$('#main').empty();
	$('#main').append('<div class="nonscrollpart"></div>');
	$('.nonscrollpart').append('<h1>阅读页面设置</h1>');
	$('#main').append('<div class="reader-config-panel scrollpart"></div>');

	$('.reader-config-panel').append('<table cellspacing=0 class="cfg_table table table-striped"></table>');
	
	//AutoPager
	$('.cfg_table').append('<tr class="cfg_tr"></tr>');
	$('.cfg_tr:last').append('<td class="cfg_td label-a">自动翻页</td><td class="cfg_td content" id="autopager"></td>');
	//AutoBookmark
	$('.cfg_table').append('<tr class="cfg_tr"></tr>');
	$('.cfg_tr:last').append('<td class="cfg_td label-a">自动书签</td><td class="cfg_td content" id="autobookmark"></td>');

	//AutoBookmark
	$('.cfg_table').append('<tr class="cfg_tr"></tr>');
	$('.cfg_tr:last').append('<td class="cfg_td label-a">时钟显示</td><td class="cfg_td content" id="clockshow"></td>');



	//AutoScroll
	$('.cfg_table').append('<tr class="cfg_tr"></tr>');
	$('.cfg_tr:last').append('<td class="cfg_td label-a">连续滚动模式</td><td class="cfg_td content" id="autoscroll"></td>');
	//read mode
	$('.cfg_table').append('<tr class="cfg_tr"></tr>');
	$('.cfg_tr:last').append('<td class="cfg_td label-a">触摸模式</td><td class="cfg_td content" id="readMode"></td>');
	//read mode
	$('.cfg_table').append('<tr class="cfg_tr"></tr>');
	$('.cfg_tr:last').append('<td class="cfg_td label-a">兼容模式下自动关闭原页面</td><td class="cfg_td content" id="autoclose"></td>');

	//read mode
//	$('.cfg_table').append('<tr class="cfg_tr"></tr>');
//	$('.cfg_tr:last').append('<td class="cfg_td label-a">页面点击翻页</td><td class="cfg_td content" id="clickpage"></td>');

	//Shortcut
	$('.cfg_table').append('<tr class="cfg_tr"></tr>');
	$('.cfg_tr:last').append('<td class="cfg_td label-a">启用Vim风格热键</td><td class="cfg_td content" id="shortkeystyle"></td>');

	//Shortcut
	$('.cfg_table').append('<tr class="cfg_tr"></tr>');
	$('.cfg_tr:last').append('<td class="cfg_td label-a">启用微博分享</td><td class="cfg_td content" id="enableWeibo"></td>');

	//Post-handle
	var cfg = JSON.parse(root.localStorage.generalReaderSetting);
	var autopager = 'on';
	if(cfg.autopage == 'true'){
		autopager = 'on';
	} else {
		autopager = 'off';
	}
	$('#autopager').iphoneSwitch(autopager,
		function() {
			cfg.autopage = "true";
			root.localStorage.generalReaderSetting = JSON.stringify(cfg);
		},
		function() {
			cfg.autopage = "false";
			root.localStorage.generalReaderSetting = JSON.stringify(cfg);
		},
		{
			switch_on_container_path: '../images/iphone_switch_container_off.png'
		}
	);

	var autobookmark = 'on';
	if(cfg.autobookmark == 'true'){
		autobookmark = 'on';
	} else {
		autobookmark = 'off';
	}
	$('#autobookmark').iphoneSwitch(autobookmark,
		function() {
			cfg.autobookmark = "true";
			root.localStorage.generalReaderSetting = JSON.stringify(cfg);
		},
		function() {
			cfg.autobookmark = "false";
			root.localStorage.generalReaderSetting = JSON.stringify(cfg);
		},
		{
			switch_on_container_path: '../images/iphone_switch_container_off.png'
		}
	);

	var clockshow = 'on';
	if(cfg.clockshow == 'true'){
		clockshow = 'on';
	} else {
		clockshow = 'off';
	}
	$('#clockshow').iphoneSwitch(clockshow,
		function() {
			cfg.clockshow = "true";
			root.localStorage.generalReaderSetting = JSON.stringify(cfg);
		},
		function() {
			cfg.clockshow = "false";
			root.localStorage.generalReaderSetting = JSON.stringify(cfg);
		},
		{
			switch_on_container_path: '../images/iphone_switch_container_off.png'
		}
	);




	var autoscroll = 'on';
	if(cfg.autoscroll == "scrolldown"){
		autoscroll = 'on';
	} else {
		autoscroll = 'off';
	}
	$('#autoscroll').iphoneSwitch(autoscroll,
		function() {
			cfg.autoscroll = "scrolldown";
			root.localStorage.generalReaderSetting = JSON.stringify(cfg);
		},
		function() {
			cfg.autoscroll = "pagedown";
			root.localStorage.generalReaderSetting = JSON.stringify(cfg);
		},
		{
			switch_on_container_path: '../images/iphone_switch_container_off.png'
		}
	);

	var readMode = 'on';
	if(root.localStorage.readMode == "touch"){
		readMode = 'on';
	} else {
		readMode = 'off';
	}
	$('#readMode').iphoneSwitch(readMode,
		function() {
			root.localStorage.readMode = 'touch';
		},
		function() {
			root.localStorage.readMode = 'default';
		},
		{
			switch_on_container_path: '../images/iphone_switch_container_off.png'
		}
	);

	var autoclose = "off";
	if(typeof(cfg.autoclose)=='undefined') cfg.autoclose = "disable";
	autoclose = (cfg.autoclose=="enable")?"on":"off";
	$('#autoclose').iphoneSwitch(autoclose,
		function() {
			cfg.autoclose = "enable";
			root.localStorage.generalReaderSetting = JSON.stringify(cfg);
		},
		function() {
			cfg.autoclose = "disable";
			root.localStorage.generalReaderSetting = JSON.stringify(cfg);
		},
		{
			switch_on_container_path: '../images/iphone_switch_container_off.png'
		}
	);

	var weiboenable = "enabled";
	if(typeof(cfg.enableWeibo)=='undefined') cfg.enableWeibo = "enabled";
	enableWeibo = (cfg.enableWeibo=="enabled")?"on":"off";
	$('#enableWeibo').iphoneSwitch(enableWeibo,
		function() {
			cfg.enableWeibo = "enabled";
			root.localStorage.generalReaderSetting = JSON.stringify(cfg);
		},
		function() {
			cfg.enableWeibo = "disabled";
			root.localStorage.generalReaderSetting = JSON.stringify(cfg);
		},
		{
			switch_on_container_path: '../images/iphone_switch_container_off.png'
		}
	);



//	var clickpage = "off";
//	if(typeof(cfg.clickpage)=='undefined') cfg.clickpage = "enable";
//	clickpage = (cfg.clickpage=="enable")?"on":"off";
//	$('#clickpage').iphoneSwitch(clickpage,
//		function() {
//			cfg.clickpage = "enable";
//			root.localStorage.generalReaderSetting = JSON.stringify(cfg);
//		},
//		function() {
//			cfg.clickpage = "disable";
//			root.localStorage.generalReaderSetting = JSON.stringify(cfg);
//		},
//		{
//			switch_on_container_path: '../images/iphone_switch_container_off.png'
//		}
//	);
//
//




	var vimstyle = 'on';
	if(cfg.shortkeystyle == 'vim'){
		vimstyle = 'on';
	} else {
		vimstyle = 'off';
	}
	$('#shortkeystyle').iphoneSwitch(vimstyle,
		function() {
			cfg.shortkeystyle = 'vim';
			root.localStorage.generalReaderSetting = JSON.stringify(cfg);
		},
		function() {
			cfg.shortkeystyle = 'normal';
			root.localStorage.generalReaderSetting = JSON.stringify(cfg);
		},
		{
			switch_on_container_path: '../images/iphone_switch_container_off.png'
		}
	);
	
}

//皮肤设置
function skinConfig(){
	curStatus = 'readerConfig';
	$('#sub-items').hide();
	$('#main').empty();
	$('#main').append('<div class="scrollpart"><div class="reader-config-panel"></div></div>');

	$('.reader-config-panel').append('<h1>阅读皮肤设置</h1>');
	$('.reader-config-panel').append('<table cellspacing=0 class="cfg_table table table-striped"></table>');
	
	var cfg = JSON.parse(root.localStorage.generalSkinSetting);
	//AutoPager
	for(var i =0; i<root.skins.length;i++){
		$('.cfg_table').append('<tr class="cfg_tr skin"></tr>');
		$('.cfg_tr:last').append('<td class="cfg_td skin label-a" name="'+root.skins[i].name+'">'+root.skins[i].display+'</td>');
		$('.cfg_tr:last').append('<td class="cfg_td skin-comment">'+root.skins[i].comment+'</td>');
		$('.cfg_tr:last').append('<td class="cfg_td skin-author"><span style="font-size:10px;">By</span> '+root.skins[i].author+'</td>');
		$('.cfg_tr:last').data('skin',root.skins[i].name);
		$('.cfg_tr:last').data('link',root.skins[i].link);
		if(cfg.skin == root.skins[i].name){
			$('.cfg_tr:last').addClass('success');
		} else {
			$('.cfg_tr:last').removeClass('success');
		}

		$('.skin-author:last').click(function(){
			chrome.tabs.create({url:$(this).parent().data('link')});		
		});
		if(root.skins[i].name=='customize' && cfg.customize==""){
			$('.cfg_td.skin.label-a:last').addClass('invalid');
		}
	}

	$('.cfg_table').append('<tr class="cfg_tr skin"></tr>');
	$('.cfg_tr:last').append('<td class="cfg_td searchskin" colspan="3" style="background:rgba(0,0,0,0.05);cursor:pointer;font-size:11px;text-align:center;"> 前往搜索皮肤</td>');

	$('.searchskin').click(function(){
		chrome.tabs.create({url:root.onlinebase + "/?tag=皮肤设置"});
	});

	$('.cfg_td.label-a').click(function(){
		if($(this).html()=='用户定义' && cfg.customize=="") {
			alert('在自定义皮肤设置之前，不允许选择自定义！');
			return;	
		}
		$('.cfg_tr').removeClass('success');
		$(this).parent().addClass('success');
		cfg.skin = $(this).parent().data('skin');
		root.localStorage.generalSkinSetting = JSON.stringify(cfg);
	});
	
}

//皮肤自定义
function skinCustomConfig(){
	curStatus = 'readerConfig';
	$('#sub-items').hide();
	$('#main').empty();
	$('#main').append('<div class="scrollpart"><div class="reader-config-panel"></div></div>');

	$('.reader-config-panel').append('<h1>自定义皮肤<span class="top-control btn pull-right skin-search">搜索</span><span class="top-control btn pull-right skin-save ">保存</span><span class="top-control btn pull-right skin-cancel ">取消</span></h1> ');
	$('.reader-config-panel').append('<div style="text-align:center;margin-top:20px;margin-bottom:20px;"><textarea id="skin-custom" style="margin-left:auto;margin-right:auto;width:95%;height:75%;" ></textarea></div>');
	
	var cfg = JSON.parse(root.localStorage.generalSkinSetting);
	$('#skin-custom').val(cfg.customize);
	if(typeof(cfg.customize)=='undefined'){
		cfg['customize']="";
	}
	$('.skin-search').click(function(){
		chrome.tabs.create({url:root.onlinebase + "/?tag=皮肤设置"});
	});

	$('.skin-save').click(function(){
		var cfg = JSON.parse(root.localStorage.generalSkinSetting);
		if(typeof(cfg.customize)=='undefined'){
			cfg['customize']="";
		}
		//保存皮肤
		cfg.customize = $('#skin-custom').val();
		//root.refineInfo(cfg);
		root.localStorage.generalSkinSetting = JSON.stringify(cfg);
		notify("皮肤保存完毕");
		$('.skin').click();
	});

	$('.skin-cancel').click(function(){
		var cfg = JSON.parse(root.localStorage.generalSkinSetting);
		if(typeof(cfg.customize)=='undefined'){
			cfg['customize']="";
		}
		$('#skin-custom').val(cfg.customize);
		notify("取消修改");
		$('.skin').click();
	});
	
}





//书签页面设置
function refreshBookmarkConfig(){
	curStatus = 'bookmarkConfig';
	$('#sub-items').hide();
	$('#main').empty();
	$('#main').append('<div class="scrollpart"><div class="bookmark-config-panel"></div></div>');

	$('.bookmark-config-panel').append('<h1>书签页面设置</h1>');
	$('.bookmark-config-panel').append('<table cellspacing=0 class="cfg_table table table-striped"></table>');
	//AutoPager
	$('.cfg_table').append('<tr class="cfg_tr"></tr>');
	$('.cfg_tr:last').append('<td class="cfg_td label-a">自动检查书籍更新</td><td class="cfg_td content" id="autocheck"></td>');
	//Post-handle
	var cfg = JSON.parse(root.localStorage.generalBookmarkSetting);
	var autocheck = 'on';
	if(cfg.autocheck == true){
		autocheck = 'on';
	} else {
		autocheck = 'off';
	}
	$('#autocheck').iphoneSwitch(autocheck,
		function() {
			cfg.autocheck = true;
			root.localStorage.generalBookmarkSetting = JSON.stringify(cfg);
		},
		function() {
			cfg.autocheck = false;
			root.localStorage.generalBookmarkSetting = JSON.stringify(cfg);
		},
		{
			switch_on_container_path: '../images/iphone_switch_container_off.png'
		}
	);
	
}

//预置站点设置
function refreshSiteConfig(type,cbFunc){
	$('#sub-items').hide();
	var sites;
	$('#main').empty();
	$('#main').append('<div class="scrollpart"><div class="site-config-panel"></div></div>');


	if(type=='official'){
		$('.site-config-panel').append('<h1>预置站点设置</h1>');
		curStatus = 'siteConfig';
	} else {
		$('.site-config-panel').append('<h1>站点设置<span class="top-control btn pull-right trash deleteall ">清空配置</span></h1>');
		curStatus = 'customSiteConfig';
	}

	$('.deleteall').click(function(){
		if(confirm("确认清空所有当前本地配置？")){
			root.initConfigTable('all');
			refreshSiteConfig(type);
		}
	});

	$('.site-config-panel').append('<table cellspacing=0 class="cfg_table table table-striped"></table>');
	
	//获取当前预置站点
	root.sqlQuery('id,name,address,enable,type','sites',function(list){
		for (var i=0;i<list.length;i++){
			if(list[i].type=="official"){
				$('.cfg_table').append('<tr class="cfg_tr official"></tr>');
			} else {
				$('.cfg_table').append('<tr class="cfg_tr"></tr>');
			}
			$('.cfg_tr:last').append('<td class="cfg_td label-a siteaddress" title="右键单击打开原始站点">'+list[i].name+'</td><td class="cfg_td content enable"></td>');
			$('.siteaddress:last').data('id',list[i].id);
			$('.siteaddress:last').data('address',list[i].address);
			$('.label-a.siteaddress:last').bind('mousedown',function(e){
			    if (e.which === 3) {
					chrome.tabs.create({url:$(this).data('address')});
			    }
			});
		}
		//指向原站点
		$('.siteaddress').each(function(index){
			$('.siteaddress').eq(index).click(function(){
				if(curStatus == 'customSiteConfig'){
					loadSiteDetailPage($(this).data('id'));
				}
			});
		});
		//Post-handle -> 使能与否
		$('.enable').each(function(index){
			var switchind = 'on';
			if(list[index].enable == 'true') {
				switchind = 'on';
			} else {
				$('.enable').eq(index).parent().find('.siteaddress').addClass('invalid');
				switchind = 'off';
			}
			$(this).iphoneSwitch(switchind,
				function() {
					$('.enable').eq(index).parent().find('.siteaddress').removeClass('invalid');
					root.sqlExec("update sites set enable='true' where id = '"+list[index].id+"';",function(res){
					});
				},
				function() {
					$('.enable').eq(index).parent().find('.siteaddress').addClass('invalid');
					root.sqlExec("update sites set enable='false' where id = '"+list[index].id+"';",function(res){
					});
				},
				{
					switch_on_container_path: '../images/iphone_switch_container_off.png'
				}
			);
		});

		if(type=='customize'){
			if($('.cfg_table .cfg_tr:first').length==0){
				$('.cfg_table').append('<tr class="cfg_tr newitem"></tr>');
			} else {
				$('.cfg_table .cfg_tr:first').before('<tr class="cfg_tr newitem"></tr>');
			}
			$('.cfg_tr:first').append('<td class="cfg_td" colspan="3"> 点击新建站点配置 </td>');

			$('.newitem').click(function(){
				loadSiteDetailPage(null);
			});
		} else {
			$('.siteaddress').css('cursor','auto');	
		}
		if(typeof(cbFunc)!='undefined') cbFunc();
	}, 'where url_reg !="" ');
	
}


function loadSiteDetailPage(id){
	$('#sub-items').show();
	$('#main').empty();
	$('#main').append('<div class="scrollpart"><div class="reader-config-panel"></div></div>');
	var info;
	if(id!=null){
		root.sqlQuery('*','sites',function(list){
			var info=list[0];
			fillDetailPage(info);
		},"where id = '"+id+"';");
	} else {
		info = {
					id:null,
					name:"新站点",
					address:"",
					url_reg:"",
					content_selector:"",
					navigation_selector:"",
					navigation_selector_pre:"",
					navigation_selector_next:"",
					title_reg : "",
					post:"0",
					title_location : "0",
					content_patch:"",
					update_patch:"",
					enable:'true',
					//Advanced Options
					updateInfoPage : "",	
					updateDiv: "",
					//
					type:'customize',
					patch:''
		};
		fillDetailPage(info);
	}
	
}


function fillDetailPage (info){
		$('.reader-config-panel').append('<h1>自定义站点详细设置 - '+info.name+' <span class="top-control btn pull-right save ">保存</span> <span class="top-control btn pull-right export ">导出</span><span class="top-control btn pull-right trash ">删除</span><span class="top-control btn pull-right home ">返回</span><span class="top-control btn pull-right online">在线</span></h1>');
		$('.reader-config-panel').append('<table cellspacing=0 class="cfg_table table table-striped"></table>');

		if(info.id==null) {
			$('.top-control.trash').addClass('invalid');
			$('.top-control.export').addClass('invalid');
		} else {
			$('.top-control.trash').addClass('nowactive').addClass('btn-warning');
			$('.top-control.export').addClass('nowactive');
		}
		$('.top-control.export').data('id',info.id);
		$('.cfg_table:first').data('curSiteId',info.id);
		//AutoPager
		$('.cfg_table:first').append('<tr class="cfg_tr"></tr>');
		$('.cfg_tr:last').append('<td class=" label-a">站点名称</td><td class=" content"><input type="text" name="name" value="'+info.name+'"></input></td>');
		$('.cfg_tr:last').append('<td class=" label-a">站点地址</td><td class=" content"><input type="text" name="address" value="'+info.address+'"></input></td>');

		$('.cfg_table:first').append('<tr class="cfg_tr"></tr>');
		$('.cfg_tr:last').append('<td class=" label-a">地址匹配</td><td class=" content"><input type="text" name="url_reg" value="'+info.url_reg+'"></input></td>');
		$('.cfg_tr:last').append('<td class=" label-a">正文选择</td><td class=" content"><input type="text" name="content_selector" value="'+info.content_selector+'"></input></td>');

		$('.cfg_table:first').append('<tr class="cfg_tr"></tr>');
		$('.cfg_tr:last').append('<td class=" label-a">前页选择</td><td class=" content"><input type="text" name="navigation_selector_pre" value="'+info.navigation_selector_pre+'"></input></td>');
		$('.cfg_tr:last').append('<td class=" label-a">后页选择</td><td class=" content"><input type="text" name="navigation_selector_next" value="'+info.navigation_selector_next+'"></input></td>');
//		$('input[name=navigation_selector_next]').val(info.navigation_selector_next);
		$('.cfg_table:first').append('<tr class="cfg_tr"></tr>');
		$('.cfg_tr:last').append('<td class=" label-a">目录选择</td><td class=" content"><input type="text" name="navigation_selector" value="'+info.navigation_selector+'"></input></td>');
		$('.cfg_tr:last').append('<td class=" label-a">兼容模式</td><td class=" content"><ul class="inline"><li><input type="radio" name="post" value="0" ><span class="label" style="font-size:11px">OFF</span></li><li><input type="radio" name="post" value="1" ><span class="label label-success" style="font-fize:11px">ON</span></li></ul></td></tr></table></td>');

		$('.cfg_table:first').append('<tr class="cfg_tr"></tr>');
		$('.cfg_tr:last').append('<td class=" label-a">标题匹配</td><td class=" content"><input type="text" name="title_reg" style="font-family:宋体;" value="'+info.title_reg+'"></input></td>');
		$('.cfg_tr:last').append('<td class=" label-a">标题位置</td><td class=" content"><ul class="inline"><li><input type="radio" name="title_location" value="0" ><span class="label">1</span></li><li><input type="radio" name="title_location" value="1" ><span class="label">2</span></li></ul></td></tr></table></td>');

		$('.cfg_table:first').after('<table cellspacing=0 class="cfg_table table table-striped"></table>');
		$('.cfg_table:last').append('<tr class="cfg_tr"></tr>');
		$('.cfg_tr:last').append('<td class=" label-a placeholder" colspan=4>内容分析补丁*</td>');
		$('.cfg_table:last').append('<tr class="cfg_tr"></tr>');
		$('.cfg_tr:last').append('<td class=" content high" colspan=4><textarea id="content_patch" style="font-family:宋体;width:98%;height:100px;"></textarea></td>');
		$('.cfg_table:last').append('<tr class="cfg_tr"></tr>');
		$('.cfg_tr:last').append('<td class=" label-a placeholder" colspan=4>更新分析补丁*</td>');
		$('.cfg_table:last').append('<tr class="cfg_tr"></tr>');
		$('.cfg_tr:last').append('<td class=" content high" colspan=4><textarea id="update_patch" style="font-family:宋体;width:98%;height:100px;"></textarea></td>');


		$('.cfg_table:last').after('<table cellspacing=0 class="cfg_table table table-striped"></table>');
		$('.cfg_table:last').append('<tr class="cfg_tr"></tr>');
		$('.cfg_tr:last').append('<td class=" label-a">更新页匹配*</td><td class=" content"><input type="text" name="updateInfoPage" value="'+info.updateInfoPage+'"></input></td>');
		$('.cfg_tr:last').append('<td class=" label-a">更新章节匹配*</td><td class=" content"><input type="text" name="updateDiv" value="'+info.updateDiv+'"></input></td>');

		//值处理
		if(typeof(info.post) =='undefined' || info.post =='undefined' || info.post==null) {
			$('input[name="post"]').get(0).checked=true;
		} else {
			$('input[name="post"]').get(info.post).checked=true;
		}
		if(typeof(info.title_location) =='undefined' || info.title_location =='undefined' || info.title_location==null) {
			$('input[name="title_location"]').get(0).checked=true;
		} else {
			$('input[name="title_location"]').get(info.title_location).checked=true;
		}
		//补丁
		if(info.content_patch!=null) $('#content_patch').val(info.content_patch.replace(/;/g,';\n'));
		$('#content_patch').val($('#content_patch').val().replace(/{/g,'{\n'));
		if(info.update_patch!=null) $('#update_patch').val(info.update_patch.replace(/;/g,';\n'));
		$('#update_patch').val($('#update_patch').val().replace(/{/g,'{\n'));

		//Bind Data
		$('.top-control.online').data('address', info.address);

		
}

function saveCurrentInfo(){
	if(curStatus!='customSiteConfig') {
		return;
	}
	var info = {
				id:null,
				name:"新站点",
				address:"",
				url_reg:"",
				content_selector:"",
				navigation_selector:"",
				navigation_selector_pre:"",
				navigation_selector_next:"",
				title_reg : "",
				post:"false",
				title_location : "0",
				content_patch:"",
				update_patch:"",
				enable:'true',
				//Advanced Options
				updateInfoPage : "",	
				updateDiv: "",
				//
				type:'customize',
				patch:''
	};
	info.name = $('input[name="name"]').val();
	info.address = $('input[name="address"]').val();
	info.url_reg = $('input[name="url_reg"]').val();
	info.content_selector = $('input[name="content_selector"]').val();
	info.navigation_selector = $('input[name="navigation_selector"]').val();
	info.navigation_selector_pre = $('input[name="navigation_selector_pre"]').val();
	info.navigation_selector_next = $('input[name="navigation_selector_next"]').val();
	info.title_reg = $('input[name="title_reg"]').val();
	info.post = $('input[name="post"]:checked').val();
	info.title_location = $('input[name="title_location"]:checked').val();

	info.content_patch = $('textarea#content_patch').val();
	info.update_patch = $('textarea#update_patch').val();

	info.enable = 'true';
	info.updateInfoPage = $('input[name="updateInfoPage"]').val();
	info.updateDiv = $('input[name="updateDiv"]').val();
	info.type = 'customize';
	info.patch = '';
	info.id =$('.cfg_table:first').data('curSiteId');
	root.refineInfo(info);
	if(info.id=='null'){
		//insert
		var db = openDatabase('rabbook', '1.0', 'rabook-db', 2 * 1024 * 1024);
		db.transaction(function (tx) {
			var nameStr = "";
			var valueStr= "";
			for(var key in info){
				switch(key){
					case 'id':
						continue;
					default:
				}
				nameStr = nameStr + key + ",";
				valueStr = valueStr + "'" + info[key] + "',";
			}
			//get rid of last comma
			nameStr=nameStr.replace(/,$/g,'');
			valueStr=valueStr.replace(/,$/g,'');

			sql = "insert into sites (" + nameStr + ") values (" + valueStr + ");"; 
  			tx.executeSql(sql);


			//update
			//insert
			var db = openDatabase('rabbook', '1.0', 'rabook-db', 2 * 1024 * 1024);
			db.transaction(function (tx) {
				var sqlStr="";
				for(var key in info){
					switch(key){
						case 'id':
							continue;
						default:
					}
					sqlStr = sqlStr + key + "='"+info[key]+"',";
				}
				//get rid of last comma
				sqlStr=sqlStr.replace(/,$/g,'');
	
				sql = "update sites set "+sqlStr+" where id='"+info.id+"';"; 
	  			tx.executeSql(sql);
				var tdate = new Date();
				var dateStr	=	"";
				dateStr = dateStr + tdate.getFullYear() + "-" + Number(tdate.getMonth()+1) + "-" + tdate.getDate() + " " + tdate.toLocaleTimeString();
				chrome.storage.local.set({'localConfigTimestamp':dateStr});
				$('.home').click();
			});
		});
	} else {
		//update
		//insert
		var db = openDatabase('rabbook', '1.0', 'rabook-db', 2 * 1024 * 1024);
		db.transaction(function (tx) {
			var sqlStr="";
			for(var key in info){
				switch(key){
					case 'id':
						continue;
					default:
				}
				sqlStr = sqlStr + key + "='"+info[key]+"',";
			}
			//get rid of last comma
			sqlStr=sqlStr.replace(/,$/g,'');

			sql = "update sites set "+sqlStr+" where id='"+info.id+"';"; 
			console.log(sql);
  			tx.executeSql(sql);
			var tdate = new Date();
			var dateStr	=	"";
			dateStr = dateStr + tdate.getFullYear() + "-" + Number(tdate.getMonth()+1) + "-" + tdate.getDate() + " " + tdate.toLocaleTimeString();
			chrome.storage.local.set({'localConfigTimestamp':dateStr});
			$('.home').click();
		});

	}
	
}

function deleteCurrentInfo(){
	if(curStatus!='customSiteConfig') {
		return;
	}
	var info_id =$('.cfg_table:first').data('curSiteId');
	if(info_id == null ) return;

	if(confirm('确认删除本站点设置?')){
		var db = openDatabase('rabbook', '1.0', 'rabook-db', 2 * 1024 * 1024);
		db.transaction(function (tx) {
			sql = "delete from sites where id = '"+info_id+"';"; 
	  		tx.executeSql(sql);
			$('.home').click();
		});
	} else {
	}
	
}


function exportSites(type,site){
	var coded=false;
	if(confirm("是否需要加密配置（以避免在线分享时被误认广告）？")){
		coded=true;
	} 

	curStatus = 'readerConfig';
	$('#sub-items').hide();
	$('#main').empty();
	$('#main').append('<div class="scrollpart"><div class="reader-config-panel"></div></div>');

	//$('.reader-config-panel').append('<h1>配置导出<span class="top-control btn pull-right site-save">保存</span></h1> ');
	$('.reader-config-panel').append('<h1>配置导出 <span class="top-control btn pull-right submit ">提交</span> <span class="top-control btn pull-right home ">返回</span></h1> ');
	$('.reader-config-panel').append('<div style="text-align:center;margin-top:20px;margin-bottom:20px;"><textarea id="site-config" style="margin-left:auto;margin-right:auto;width:95%;height:75%;" ></textarea></div>');
	var cfg = JSON.parse(root.localStorage.generalSkinSetting);
	switch(type){
		case 'all':
			root.sqlQuery('*','sites',function(ret){
				var textStr = JSON.stringify(ret);
				textStr = textStr.replace(/,/g,',\n');
				textStr = textStr.replace(/{/g,'{\n');
				if(coded) textStr = xescape(textStr);
				$('#site-config').val(textStr).select();

			}," ");
			break;
		case 'single':
			root.sqlQuery('*','sites',function(ret){
				var textStr = JSON.stringify(ret);
				textStr = textStr.replace(/,/g,',\n');
				textStr = textStr.replace(/{/g,'{\n');
				if(coded) textStr = xescape(textStr);
				$('#site-config').val(textStr).select();
			}," where id='"+site+"'");
			break;
		default:
	}

	
}

function importSite(){
	var coded=false;
	if(confirm("待导入的是否加密数据？")){
		coded=true;
	} 


	curStatus = 'readerConfig';
	$('#sub-items').hide();
	$('#main').empty();
	$('#main').append('<div class="scrollpart"><div class="reader-config-panel"></div></div>');

	$('.reader-config-panel').append('<h1>配置导入<span class="top-control btn pull-right import ">导入</span></h1> ');
	$('.reader-config-panel').append('<div style="text-align:center;margin-top:20px;margin-bottom:20px;"><textarea id="site-config-import" style="margin-left:auto;margin-right:auto;width:95%;height:75%;" ></textarea></div>');

	$('.import').click(function(){
		if(confirm("确定导入?")){
			var configStr = $('#site-config-import').val();
			if(coded) configStr = unxescape(configStr);
			configStr = configStr.replace(/\n/g,'');
			var configs = JSON.parse(configStr);
			root.initConfigTable('import',configs);
			var alertStr = "成功导入"+configs.length+"条配置!";
			refreshSiteConfig('customize');
			$('.config-menu-item').removeClass('valid');
			$('.config-menu-item[name="customize"]').addClass('valid');
			notify(alertStr, 'new');
		}
	});
	
}

function notify(str,style){

	if(style=='new'){
		$('#notify').html(str).show();	
	} else if(style=='append'){
		$('#notify').html($('#notify').html() + " " + str).show();	
	} else {
		$('#notify').html(str).show();	
	}
}

function obcStatus(){
	curStatus = 'readerConfig';
	$('#sub-items').hide();
	$('#main').empty();
	$('#main').append('<div class="scrollpart"><div class="reader-config-panel"></div></div>');


	if(root.obcAuth.hasAccessToken()){
		$('.reader-config-panel').append('<h1 >睿读同步状态 <span class="top-control btn pull-right obc-connect ">断开</span></h1> ');
	} else {
		$('.reader-config-panel').append('<h1 >睿读同步状态 <span class="top-control btn pull-right obc-connect">连接</span></h1> ');
	}
	syncStatusContent = $("<div class='statusContent'></div>");


	if(root.obcAuth.hasAccessToken()){
		syncStatusContent.empty();
		syncStatusContent.append("<div class='table table-striped notify-status label-a'>连接</div>");
	} else {
		syncStatusContent.empty();
		syncStatusContent.append("<div class='table table-striped notify-status label-a'>未设置，请点击连接</div>");
	}

	$('.statusContent').empty();
	$('.reader-config-panel').append(syncStatusContent);
	$('.reader-config-panel').append('<hr>');
	$('.loader-span').removeClass('run').addClass('stop');
}



function syncStatus(){
	curStatus = 'readerConfig';
	$('#sub-items').hide();
	$('#main').empty();
	$('#main').append('<div class="scrollpart"><div class="reader-config-panel"></div></div>');


	if(checkToken('kuaipan')) {
	$('.reader-config-panel').append('<h1 ">当前同步状态 <span class="top-control btn pull-right connect ">断开</span></h1> ');
	} else {
	$('.reader-config-panel').append('<h1 >当前同步状态 <span class="top-control btn pull-right connect">连接</span></h1> ');
	}
	syncStatusContent = $("<div class='statusContent'></div>");

	if(root.oauth.hasToken()){
		chrome.storage.local.get({'clouduser':{'user_id':'未知','user_name':'未知','max_file_size':'NA','quota_used':'NA'}}, function(item){
			syncStatusContent.append("<table class='table table-striped notify-status'></table>");
			var syncStatusTable = syncStatusContent.find('table');
			syncStatusTable.append("<tr></tr>");
			syncStatusTable.find('tr:first').append("<td class='label-a'>用户名</td>");
			syncStatusTable.find('tr:first').append("<td>"+item.clouduser.user_name+"</td>");
//			syncStatusTable.find('tr:first').append("<td class='label-a'>用户id</td>");
//			syncStatusTable.find('tr:first').append("<td>"+item.clouduser.user_id+"</td>");
//			syncStatusTable.find('tr:first').append("<td class='label-a'>最大上传尺寸</td>");
//			syncStatusTable.find('tr:first').append("<td>"+Math.round(item.clouduser.max_file_size/1048576)+" MB</td>");
//			syncStatusTable.find('tr:first').append("<td class='label-a'>所用空间</td>");
//			syncStatusTable.find('tr:first').append("<td>"+Math.round(item.clouduser.quota_used/1048576)+" MB</td>");


			chrome.storage.local.get({'datasynchistory':{'lastupdatetime':'从未','lastsize':'不详'}}, function(item){
				var syncStatusTable = syncStatusContent.find('table');
				chrome.storage.local.get({'localConfigTimestamp': '1900-01-01 00:00:00'}, function(litem){
					syncStatusTable.find('tr:last').append("<td class='label-a'>配置文件大小</td>");
					syncStatusTable.find('tr:last').append("<td>"+item.datasynchistory.lastsize+"</td>");
					syncStatusTable.append("<tr></tr>");
					syncStatusTable.find('tr:last').append("<td class='label-a'>最近同步时间</td>");
					syncStatusTable.find('tr:last').append("<td>"+item.datasynchistory.lastupdatetime+"</td>");
					syncStatusTable.find('tr:last').append("<td class='label-a'>本地更新时间</td>");
					syncStatusTable.find('tr:last').append("<td>"+litem.localConfigTimestamp+"</td>");
					syncStatusTable.append("<tr></tr>");
					syncStatusTable.append("<tr></tr>");
				});
			});

		});

	} else {
		syncStatusContent.empty();
		syncStatusContent.append("<div class='table table-striped notify-status label-a'>未同步，请点击认证连接</div>");
	}

	$('.statusContent').empty();
	$('.reader-config-panel').append(syncStatusContent);
	$('.reader-config-panel').append('<hr>');
	$('.loader-span').removeClass('run').addClass('stop');

	
}


function weiboStatus() {
	$('#sub-items').hide();
	$('#main').empty();
	$('#main').append('<div class="scrollpart"><div class="reader-config-panel"></div></div>');


	if(root.weiboAuth.hasAccessToken()){
	$('.reader-config-panel').append('<h1 class="">当前连接状态<span class="top-control btn pull-right weibo-connect ">断开</span></h1> ');
	} else {
	$('.reader-config-panel').append('<h1 class="">当前连接状态 <span class="top-control btn pull-right weibo-connect">连接</span></h1> ');
	}
	syncStatusContent = $("<div class='statusContent'></div>");

	if(root.weiboAuth.hasAccessToken()){
		chrome.storage.local.get({'weiboname':'未知'}, function(item){
			syncStatusContent.append("<table class='table table-striped notify-status'></table>");
			var syncStatusTable = syncStatusContent.find('table');
			syncStatusTable.append("<tr></tr>");
			syncStatusTable.find('tr:first').append("<td class='label-a'>用户名</td>");
			syncStatusTable.find('tr:first').append("<td>"+item.weiboname+"</td>");
		});
	} else {
		syncStatusContent.empty();
		syncStatusContent.append("<div class='table table-striped notify-status label-a'>未设置，请点击连接</div>");
	}

	$('.statusContent').empty();
	$('.reader-config-panel').append(syncStatusContent);
	$('.reader-config-panel').append('<hr>');
	$('.loader-span').removeClass('run').addClass('stop');
	
}


function getRemoteConfig(){
	//获取远端初始配置
	curStatus = 'readerConfig';
	$('#sub-items').hide();
	$('#main').empty();
	$('#main').append('<div class="scrollpart"><div class="reader-config-panel"></div></div>');

	$('.reader-config-panel').append('<h1>站点配置获取</h1>');
	$('.reader-config-panel').append('<table cellspacing=0 class="cfg_table table table-striped" style="margin-top:20px;"></table>');
		
	$('.cfg_table').append('<tr class="cfg_tr"></tr>');
	$('.cfg_tr:last').append('<td class="cfg_td label-a ">更新推荐站点<span style="cursor:pointer;" id="to-recommend-list">：从云端读取最新预置站点信息，点击查看列表</span></td><td class="cfg_td tdbutton" id="loadremote" style="text-align:right;"><a href="#" style="width:100px;margin-right:10%;" class="btn icon loop ">开 始 更 新</a></td>');
	$('.cfg_table').append('<tr class="cfg_tr"></tr>');
	$('.cfg_tr:last').append('<td class="cfg_td label-a nobottom">搜索站点配置<span>：从云端搜索特定站点配置,目前仅支持域名搜索</span></td><td class="cfg_td tdbutton nobottom" id="loadremote" style="text-align:right;"><a href="#" style="width:100px;margin-right:10%;" class="btn icon search " >开 始 搜 索</a></td>');
	$('.icon.search').bind('click',function(){
		if($('.loader-span').hasClass("run")) {
			return false;	
		}
		apprise("请输入网站的域名(eg. www.abc.com则填写abc.com):", {"input":true, "textOk":"Search", "textCancel":"Back"},function(r){
			if(r!=false) {
				searchConfig(r,listConfigs);
			}
		});
	});
	$('#to-recommend-list').click(function(){
		chrome.tabs.create({url:root.onlineindex});
	});
	$('.icon.loop').bind('click',function(){

		if($('.loader-span').hasClass("run")) {
			return false;	
		}

		if(confirm("确认载入云端配置?")) {
				loadConfig();
		}
//		apprise("确认载入云端配置?", { "confirm":true,"textOk":"Load"},function(r){
//			if(r!=false) {
//				loadConfig();
//			}
//		});
	});


	
	$('.reader-config-panel').append('<div class="cfg_list_notify" style="display:none" id="loader-show-result"></div>');

	$('.reader-config-panel').append('<table cellspacing=0 class="cfg_list_table" style="display:none" id="loader-result"></table>');
	$('.cfg_list_table').append('<tr class="cfg_list_tr"></tr>');
	$('.cfg_list_tr:last').append('<td class="cfg_list_td label-a">Site 0 </td><td class="cfg_list_td content"><a href="#" class="btn " style="width:80px;padding:3px">导入</a></td>');
	$('.cfg_list_table').append('<tr class="cfg_list_tr"></tr>');
	$('.cfg_list_tr:last').append('<td class="cfg_list_td label-a">Site 1 </td><td class="cfg_list_td content"><a href="#" class="btn" style="width:80px;padding:3px">导入</a></td>');

	$('.cfg_list_tr:odd').addClass('odd');
	$('.cfg_list_tr:even').addClass('even');
}

function searchConfig(domain, listhandler){
	var searchUrl = root.onlinebase + "/?tag=" + domain + " li.post.text";
	var tmpDiv = $("<div></div>");
	
	$('#loader-show-result').hide();
	$('#loader-result').hide();
	$('.loader-span').addClass('run').removeClass('stop');

	tmpDiv.load(searchUrl, function(data){ //实际上要放在这里的仅仅是列表而不是直接的结果
		var configs = [];
		var titles = tmpDiv.find('.jjl_title');
		for(var i=0; i<titles.length; i++) {
			var curConfig = {"name":titles.eq(i).text(), "href":titles.eq(i).find("a").attr('href')};
			configs.push(curConfig);
		}
		if(typeof(listhandler) != 'undefined'){
			listhandler(configs);
		}
		$('.loader-span').addClass('stop').removeClass('run');
	});

	
}

function listConfigs(configs){
	if(configs.length==0){
		$('#loader-show-result').html('对不起，没有搜索到已有配置——不如自己试试？<a target="_blank" href="'+root.onlinebase + '/submit">同时欢迎提交你的配置</a>');
		$('#loader-show-result').show();
	} else {
		$('.cfg_list_table').empty();
		for(var i =0; i<configs.length; i++){
			$('.cfg_list_table').append('<tr class="cfg_list_tr"></tr>');
			$('.cfg_list_tr:last').append('<td class="cfg_list_td label-a searchresult" style="cursor:pointer;" >'+ configs[i].name +'</td><td class="cfg_list_td content"><a href="#" class="btn " style="width:80px;padding:3px">导 入</a></td>');
			$('.cfg_list_tr:last').data('config-link',configs[i].href);
		}
		$('#loader-show-result').text('得到配置结果如下:');
		$('#loader-show-result').show();
		$('#loader-result').show();
		//bind the click import action:
		$('.cfg_list_td.searchresult').click(function(){
			chrome.tabs.create({url:$(this).parent().data('config-link')});
		})
		$('.cfg_list_td.content a').click(function(){
			var configlink = $(this).parent().parent().data('config-link');
			fetchConfig(configlink, function(){
				var tdate = new Date();
				var dateStr	=	"";
				dateStr = dateStr + tdate.getFullYear() + "-" + Number(tdate.getMonth()+1) + "-" + tdate.getDate() + " " + tdate.toLocaleTimeString();
				chrome.storage.local.set({'localConfigTimestamp':dateStr});
				var alertStr = "成功导入配置!";
				notify(alertStr, 'new');
			});
		});

	}
	
}

function fetchConfig(link, CB, type) {
	if(typeof(type)=='undefined') type = 'customize';
	var tmpContent = $('<div></div>');
	tmpContent.load(link + " div.jjl_body", function(data){
		var pureStr = tmpContent.text().replace(/\n/g,'');
		pureStr = pureStr.replace(/^\s*/g,'');
		var downloadCfg = JSON.parse(pureStr);
		if(type=="official") {
			for(var j=0;j<downloadCfg.length;j++){
				downloadCfg[j].type = "official";
			}
		} else {
			for(var j=0;j<downloadCfg.length;j++){
				downloadCfg[j].type = "customize";
			}
		}
		root.initConfigTable('import',downloadCfg);
		if(typeof(CB)!='undefined') {
			CB();
		}
	});
	
}



function loadConfig(){
	//Get the menu list
	$('.loader-span').addClass('run').removeClass('stop');
	var tmpContent = $('<div></div>');
	var link = root.onlineindex;
	tmpContent.load(link + " div.jjl_body", function(data){
		var pureStr = tmpContent.text().replace(/\n/g,'');
		pureStr = pureStr.replace(/^\s*/g,'');
		pureStr = '{"sitelinks":' + pureStr + '}';

		var cfgList = JSON.parse(pureStr);
		root.resetAllTypes(function(r){
			for(var i =0; i< cfgList.sitelinks.length; i++){
				fetchConfig(cfgList.sitelinks[i].config, function(){
				},"official");
			}
			var tdate = new Date();
			var dateStr	=	"";
			dateStr = dateStr + tdate.getFullYear() + "-" + Number(tdate.getMonth()+1) + "-" + tdate.getDate() + " " + tdate.toLocaleTimeString();
			chrome.storage.local.set({'localConfigTimestamp':dateStr});
			var alertStr = "成功导入"+cfgList.sitelinks.length+"条配置!";
			notify(alertStr, 'new');
			$('.loader-span').addClass('stop').removeClass('run');
		});
	});
}
