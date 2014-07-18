var tabName = 'popup-tab';
//var root = chrome.extension.getBackgroundPage();
var root = chrome.extension.getBackgroundPage();

setTimeout(function(){popInit();},1);
function popInit(){
	$(document).ready(function(){
		$('.popupmain').append("<tr class='popTr'><td class='popTd'><span class='bighubbutton btn-list'><span><span class='bighubicon'></span>&nbsp 管理中心 &nbsp</span></span></td></tr>");
		$('.popupmain').append("<tr class='popTr'><td class='popTd'><span class='bighubbutton btn-action'><span><span class='bighubicon'></span>&nbsp 阅读本页 &nbsp</span></span></td></tr>");
		$('.popupmain').append("<tr class='popTr'><td class='popTd'><span class='bighubbutton btn-add'><span><span class='bighubicon'></span>&nbsp 加入书架 &nbsp</span></span></td></tr>");
		/* jQuery */
		 jQuery('span.bighubbutton').bind({
		    mousedown: function() {
		      jQuery(this).addClass('mousedown');
		    },
		    blur: function() {
		      jQuery(this).removeClass('mousedown');
		    },
		    mouseup: function() {
		      jQuery(this).removeClass('mousedown');
		    }
		  });
		//Bind Actions
		$('.btn-add').click(function(){
			//check current url	
			chrome.tabs.getSelected(null,function(tab){
				if(tab.url.match(/^chrome-extension:\/\//)!=undefined){
					return;
				}
				try {
					if(root.entryTab.id != tab.id) {
						//chrome.tabs.remove(root.entryTab.id);
						//解除原Port
						unHookPort();
					}
				} catch (err) {
				}
				root.entryTab = tab;

				chrome.tabs.insertCSS(tab.id, {file:'css/showUI.user.css'});
				chrome.tabs.executeScript(tab.id, {file:'js/showUI.user.js'}, function(){
					var curUrl = tab.url;
					var curTitle = tab.title;
					root.getSetBasedOnUrl(curUrl,function(config){
						if(config==null){
							root.externalShow('站点不支持，请确认配置');
						} else {
							//找到目录页
							var tmpDiv = $('<div></div>');
							tmpDiv.load(curUrl + " " + root.curSiteConfig.navigation_selector, function(){
								var tmpReg = new RegExp(config.title_reg);
								var curBook = curTitle.replace(tmpReg,'$1');
								var curChapter = curTitle.replace(tmpReg,'$2');
								//删除掉所有的下划线
								curBook = curBook.replace(/_/g,' ');
								curBook = curBook.replace(/^\s*(\S+[\s\S]*\S+)\s*/g,'$1');
								curChapter = curChapter.replace(/_/g,' ');
								curChapter = curChapter.replace(/^\s*(\S+[\s\S]*\S+)\s*/g,'$1');
								//找到目录页
								console.log(tmpDiv.children(0));
								//书签添加
								var page = {
									curBook:curBook,
									curSite:config.name,
									curChapter:curChapter,
									curMenu:tmpDiv.children(0).attr('href'),
									curUrl:curUrl
								};
								root.insertBookmark(page);
							});
						};
					});
				});

			});
		});

		$('.btn-action').click(function(){
			root.entryBusy = false;
			//check current url	
			chrome.tabs.getSelected(null,function(tab){
				if(tab.url.match(/^chrome-extension:\/\//)!=undefined){
					return;
				}
				try {
					if(root.entryTab.id != tab.id) {
						//chrome.tabs.remove(root.entryTab.id);
						//解除原Port
						unHookPort();
					}
				} catch (err) {
				}
				root.entryTab = tab;

				chrome.tabs.insertCSS(tab.id, {file:'css/showUI.user.css'});
				chrome.tabs.executeScript(tab.id, {file:'js/showUI.user.js'}, function(){
					root.startParse(root.entryTab.url);
				});
				console.log(root.entryTab);
			});
		});
		$('.btn-list').click(function(){
			chrome.tabs.create({url:'bookmarks.html'});
		});

	});
}

