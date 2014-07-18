var dirId=null;
var fakeDir = []; 
var waitForBookmark=null;
var delCnt;

function addBookmark(info,type){
	if(typeof(type)=='undefined') type = "normal";
	root.bookmarkbusy = true;
	waitForBookmark = info;
	// 预检查	
	checkBookmarkInstance(function(){
		if(dirId == null){
			initBookmark(function(){
				if(type=="normal"){
					insertBookmark(waitForBookmark);
				} else if(type=="silent"){
					insertBookmark(waitForBookmark,'silent');
				} else {
					importBookmark(waitForBookmark);
				}
			});
		} else {
				if(type=="normal"){
					insertBookmark(waitForBookmark);
				} else if(type=="silent"){
					insertBookmark(waitForBookmark,'silent');
				} else {
					importBookmark(waitForBookmark);
				}
		}
	});
}

function insertBookmark(page,type){
	if(typeof(type)=='undefined') type = "normal";
	chrome.bookmarks.getSubTree(dirId, function(subTree){
		delCnt=0;

		chrome.bookmarks.create({parentId:dirId,title:"_ReadBook_["+page.curBook+"]_["+getCurrentDate()+"]_"+"["+page.curSite+"]_[]_"+page.curChapter,url:page.curUrl + "_[menu]_" + page.curMenu}, function(){
			if(type == 'normal') {
				innerShow('书签更新完成');		
				externalShow('书签更新完成');		
			}
			//删除重复
			for(var i=0;i<subTree[0].children.length;i++){
				var tmpBook;
				var curChild = subTree[0].children[i];
				tmpBook = curChild.title.replace(/^_ReadBook_\[([\s\S]*?)\][\s\S]*/,'$1');
				if(tmpBook == page.curBook || curChild.title.match(/^_ReadBook_[\s\S]*/) == null){
					chrome.bookmarks.remove(curChild.id, function(){ //删除重复
						delCnt ++;
					});
				} 
			}
			if(type == 'normal') {
				setTimeout(function(){innerShow('清理'+delCnt+'条书签', 'append');refreshBookmark(); root.localStorage.newBookmark = true;$('.arrowup').addClass('primary');},100);
					root.bookmarkbusy = false;
			}
		});
	});
}

function importBookmark(page){
	chrome.bookmarks.getSubTree(dirId, function(subTree){
		delCnt=0;
		chrome.bookmarks.create({parentId:dirId,title:page.title,url:page.url}, function(){
			root.bookmarkbusy = false;
			//删除重复
			for(var i=0;i<subTree[0].children.length;i++){
				var tmpBook;
				var curChild = subTree[0].children[i];
				tmpBook = curChild.title.replace(/^_ReadBook_\[([\s\S]*?)\][\s\S]*/,'$1');
				var pgtitle = page.title.replace(/^_ReadBook_\[([\s\S]*?)\][\s\S]*/,'$1');
				if(tmpBook == pgtitle || curChild.title.match(/^_ReadBook_[\s\S]*/) == null){
					chrome.bookmarks.remove(curChild.id, function(){ //删除重复
						delCnt ++;
					});
				} 
			}
			setTimeout(function(){refreshBookmark(); root.localStorage.newBookmark = true;$('.arrowup').addClass('primary');},100);
		});

	});
}


function initBookmark(cbFunc){
	chrome.bookmarks.create({parentId:"1",title:"ReadBook"}, function(tree){
		dirId = tree.id;
		chrome.bookmarks.create({parentId:tree.id,title:"_ReadBook_List_",url:"about:config",index:0}, function(subTree){
			//console.log(subTree);
			if(typeof(cbFunc)!='undefined') cbFunc();
		});
	});
}

function checkBookmarkInstance(cbFunc){
	chrome.bookmarks.search("_ReadBook_List_",function(info){
		if(info.length==0){
			dirId = null;
			if(typeof(cbFunc)!='undefined') cbFunc();
		} else {
			//反查父目录
			fakeDir = []; 
			for (var i=0;i<info.length;i++){
				chrome.bookmarks.get(info[i].parentId,function(pinfo){
					if(pinfo[0].title != 'ReadBook'){
						fakeDir.push(pinfo[0].id);
					} else {
						dirId = pinfo[0].id;
						if(typeof(cbFunc)!='undefined') cbFunc();
					}
				});
			}
		}
	});
}

function fetchBookmarks(cbFunc){
	chrome.bookmarks.getSubTree(dirId, function(subTree){
		cbFunc(subTree[0].children);	
	});
}



