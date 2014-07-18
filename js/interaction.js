function externalShow(value){
	if(entryTabPort!=null){
		entryTabPort.postMessage({message:'show message',value:value});
	}
}
function innerShow(value,style){
	if(typeof(style)=='undefined') style='new';
	if(readerTabPort!=null) readerTabPort.postMessage({message:'notify',value:value,style:style});
}

//新建阅读页面 
function createNewPage(info){
	var preId = -1;
	curPageInfo = info;
	if(readerTab!=null) {
		preId = readerTab.id;
	} else {
		preId = -1;
	}

	tabExisted(preId,function(res){
		if(res) {
			//如果存在,直接刷新
			//readerTabPort.postMessage({message:'refresh content'});
			//chrome.tabs.update(readerTab.id,{selected:true});
			chrome.tabs.remove(readerTab.id,function(){
				//如果不存在,新建，靠background的listener来刷新
				chrome.tabs.create({url:'reader.html'},function(tab){
					readerTab = tab;
				});	
			});
		} else {
			//如果不存在,新建，靠background的listener来刷新
			chrome.tabs.create({url:'reader.html'},function(tab){
				readerTab = tab;
			});	
		}
	});
}

//trigger Bookmark
function refreshBookmark(){
	if(bookMarkTabPort!=null) {
		bookMarkTabPort.postMessage({message:'refresh content'});
	}
}
