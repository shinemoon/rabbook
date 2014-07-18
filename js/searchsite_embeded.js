var root = chrome.extension.getBackgroundPage();
$(document).ready(function(){
	$('.searchsite-frame').append('<div class="cfg_list_notify" style="display:none" id="loader-gif"><span><img class="loader-span stop" src="../images/loader.gif"></img></span></div>');

	
	$('.searchsite-frame').append('<div class="cfg_list_notify" style="display:none" id="loader-show-result"></div>');

	$('.searchsite-frame').append('<table cellspacing=0 class="cfg_list_table table table-striped" style="display:none" id="loader-result"></table>');
	$('.cfg_list_table').append('<tr class="cfg_list_tr"></tr>');


	root.searchConfig(root.curSearchDomain, function(configs){
		listConfigs(configs);
	});


	$('#notify').hover(function(){
		$(this).hide();
	});

});


function listConfigs(configs){
	if(configs.length==0){
		$('#loader-show-result').html('对不起，没有搜索到已有配置——不如自己试试？<a target="_blank" href="'+root.onlinebase + '/submit">同时欢迎提交你的配置</a>');
		$('#loader-show-result').show();
		$('.searchsite-frame').append('<div class="cfg_list_notify help-indicator" style="cursor:pointer;color:brown;"> 请参考帮助文件尝试 - Your Geeks Are So Cute ~ </div>');
		$('.searchsite-frame').append('<div class="cfg_list_notify baidu-indicator" style="cursor:pointer;color:rgba(255,0,0,0.5);;"> 还是你无解了，寻求贴吧帮助吧?</div>');

		$('.cfg_list_notify.help-indicator').click(function(){
			chrome.tabs.create({url:"help.html#config"});
		});
		$('.cfg_list_notify.baidu-indicator').click(function(){
			chrome.tabs.create({url:"http://tieba.baidu.com/rabbook"});
		});

	} else {
		$('.cfg_list_table').empty();
		for(var i =0; i<configs.length; i++){
			$('.cfg_list_table').append('<tr class="cfg_list_tr"></tr>');
			$('.cfg_list_tr:last').append('<td class="cfg_list_td searchresult" style="cursor:pointer;" >'+ configs[i].name +'</td><td class="cfg_list_td content"><a href="#" class="btn btn-mini" style="width:80px;padding:3px">导 入</a></td>');
			$('.cfg_list_tr:last').data('config-link',configs[i].href);
		}
		$('#loader-show-result').text('搜索试图匹配结果如下:');
		$('#loader-show-result').show();
		$('#loader-result').show();
		//bind the click import action:
		$('.cfg_list_td.searchresult').click(function(){
			chrome.tabs.create({url:$(this).parent().data('config-link')});
		})
		$('.cfg_list_td.content a').click(function(){
			var configlink = $(this).parent().parent().data('config-link');
			root.fetchConfig(configlink, function(){
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


function notify(str,style){

	if(style=='new'){
		$('#notify').html(str).show();	
	} else if(style=='append'){
		$('#notify').html($('#notify').html() + " " + str).show();	
	} else {
		$('#notify').html(str).show();	
	}
}



