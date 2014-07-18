function notify(str,style){

	if(style=='new'){
		$('#notify').html(str).show();	
	} else if(style=='append'){
		$('#notify').html($('#notify').html() + " " + str).show();	
	} else {
		$('#notify').html(str).show();	
	}
}


function checkBookmarkUpdate(hdl,newStub, index) { //hdl should be handler for bookmarkTr
	hdl.addClass('error');
	root.getUpdateInfo(hdl.find('.chapter').data('url'), hdl.find('.chapter').data('fullurl'),function(info){
		var stub = $('<div></div>');
		stub.append(info);
		if(stub.html()=='N/A') {
			hdl.removeClass('error');
			hdl.find('.name').removeClass('noupdate').removeClass('hasupdate').addClass('novalidupdate');
			hdl.find('.id').removeClass('noupdate').removeClass('hasupdate').addClass('novalidupdate');
			hdl.find('.name').attr('title','该书站设置不支持更新扫描，请确认配置');
			return;
		}
		var curChap = hdl.find('.chapter').html();
		var curBookName =hdl.find('.name').html();
		var curBookDate = hdl.find('.date').html();
		var curBookSite = hdl.find('.site').html();

		if(stub.find('a').length==0){
			//Not valid update info setting
			hdl.find('.name').removeClass('noupdate').removeClass('hasupdate').addClass('novalidupdate');
			hdl.find('.id').removeClass('noupdate').removeClass('hasupdate').addClass('novalidupdate');
			hdl.find('.name').attr('title','该书站更新扫描设置错误,或服务器错误, 请确认');
		} else {
			chrome.bookmarks.update(hdl.find('.id').attr('value'), {title:"_ReadBook_["+curBookName+"]_["+curBookDate+"]_"+"["+curBookSite+"]_["+stub.find('a').text()+"]_"+curChap}, function(){
			if(stub.find('a').text().replace(/\s/g,'') != curChap.replace(/\s/g,'')){
					hdl.find('.name').removeClass('noupdate').removeClass('novalidupdate').addClass('hasupdate');
					hdl.find('.id').removeClass('noupdate').removeClass('novalidupdate').addClass('hasupdate');
					hdl.find('.name').attr('title',stub.find('a').text());
				} else {
					hdl.find('.name').removeClass('novalidupdate').removeClass('hasupdate').addClass('noupdate');
					hdl.find('.id').removeClass('novalidupdate').removeClass('hasupdate').addClass('noupdate');
					hdl.find('.name').attr('title',stub.find('a').text());
				}
			});
		}
		hdl.removeClass('error');
	}, newStub, index);
}

function refreshRightPanel(hdl){
	var curChap = hdl.find('.chapter').html()

	$('.infocontent.name').html(hdl.find('.name').html());
	$('.updating-date').html(hdl.find('.date').html());

	$('.operation.check').unbind('click').bind('click',function(){
		root.updateSandbox = {}; //Clear all history
		checkBookmarkUpdate(hdl);
	});

	$('.operation.done').unbind('click').bind('click',function(){
		if(confirm('确认本书阅读完毕，并且删除？')){
			var bmkId = hdl.find('.id').attr('value');	
			chrome.bookmarks.remove(bmkId, function(){ 
				$('.profile-number.read_done').html(Number($('.profile-number.read_done').html()) + 1);
				syncStat(true);
				root.fetchBookmarks(function(list){fillBookmarks(list);});
			});
		}
	});

	$('.operation.drop').unbind('click').bind('click',function(){
		if(confirm('确认本书放弃阅读，并且删除？')){
			var bmkId = hdl.find('.id').attr('value');	
			chrome.bookmarks.remove(bmkId, function(){ 
				$('.profile-number.dropped').html(Number($('.profile-number.dropped').html()) + 1);
				syncStat(true);
				root.fetchBookmarks(function(list){fillBookmarks(list);});
			});
		}
	});
}

function fillRecents(){
	if(typeof(root.localStorage.recentList) == 'undefined'){
		root.localStorage.recentList = "[]";
	}

	var list = JSON.parse(root.localStorage.recentList);
	$('.recent-list').empty();	
	$('.recent-list').append("<tr><th>最近阅读书籍<i class='icon-refresh pull-right read-reset'></i></th></tr>");
	for(var i=0;i<list.length;i++){
		$('.recent-list').append("<tr><td colspan='2' class='book-name'></td></tr>");
		$('.recent-list .book-name:last').append(list[list.length-i-1].curBook).data('url',list[list.length-i-1].curUrl);
	}
	$('.recent-list .book-name:first').addClass('start');
	$('.recent-list .book-name:last').addClass('end');
}

function fillBookmarks(list,scan){
	if(typeof(scan)=='undefined'){
		scan = false;
	}
	$('table.bookmark').empty();
	if(list[0].title!='_ReadBook_List_'){
		optScroll();
		return;
	} else {
		for(var i=list.length-1;i>=1;i--){
			var curBook = list[i].title.replace(/^_ReadBook_\[([\s\S]*?)\][\s\S]*/,'$1');
			var curChapter = list[i].title.replace(/^_ReadBook_\[[\s\S]*?\]_\[[\s\S]*?\]_\[[\s\S]*\]_\[[\s\S]*\]_([\s\S]*)/,'$1');
			var curD= list[i].title.replace(/^_ReadBook_\[[\s\S]*?\]_\[([\s\S]*?)\]_[\s\S]*/,'$1');
			var curSite= list[i].title.replace(/^_ReadBook_\[[\s\S]*?\]_\[[\s\S]*?\]_\[([\s\S]*?)\]_[\s\S]*/,'$1');
			var curUpdate = list[i].title.replace(/^_ReadBook_\[[\s\S]*?\]_\[[\s\S]*?\]_\[[\s\S]*?\]_\[([\s\S]*?)\]_[\s\S]*/,'$1');
			$('table.bookmark').append("<tr class='bookmarkTr'></tr>");
			$('.bookmarkTr:last').append("<td class='bookmarkTd id' value='"+list[i].id+"'>+</td>");
			$('.bookmarkTr:last').append("<td class='bookmarkTd name' title='点击查看详情'>"+curBook+"</td>");
			$('.bookmarkTr:last').append("<td class='bookmarkTd chapter' title='左键点击打开阅读,右键点击打开原始页面'>"+curChapter+"</td>");
			$('.bookmarkTr:last').append("<td class='bookmarkTd date'>"+curD+"</td>");
			$('.bookmarkTr:last').append("<td class='bookmarkTd site' title='点击打开原站点'>"+curSite+"</td>");
			$('.bookmarkTr:last').append("<td class='bookmarkTd ratinginfo end'><span class='currate'>-</span></td>");
			var realMenu = list[i].url.replace(/.*?_\[menu\]_(.*)/, '$1');
			var realUrl = list[i].url.replace(/(.*?)_\[menu\]_.*/, '$1');
			$('.bookmarkTd.chapter:last').data('fullurl',list[i].url);
			$('.bookmarkTd.chapter:last').data('url',realUrl);
			$('.bookmarkTd.chapter:last').data('menu',realMenu);
			if(curUpdate==''){
				$('.bookmarkTd.name:last').removeClass('hasupdate').removeClass('noupdate').addClass('novalidupdate');
				$('.bookmarkTd.id:last').removeClass('hasupdate').removeClass('noupdate').addClass('novalidupdate');
			} else if(curUpdate.replace(/\s/g,'')!=curChapter.replace(/\s/g,'')){
				$('.bookmarkTd.name:last').addClass('hasupdate').removeClass('noupdate').removeClass('novalidupdate');
				$('.bookmarkTd.id:last').addClass('hasupdate').removeClass('noupdate').removeClass('novalidupdate');
				$('.bookmarkTd.name:last').attr('title',curUpdate);
			} else {
				$('.bookmarkTd.name:last').removeClass('hasupdate').addClass('noupdate').removeClass('novalidupdate');
				$('.bookmarkTd.id:last').removeClass('hasupdate').addClass('noupdate').removeClass('novalidupdate');
				$('.bookmarkTd.name:last').attr('title',curUpdate);
			}
		}
		$('.bookmarkTr:odd').addClass('odd');
		$('.bookmarkTr:even').addClass('even');
		//Check if need to auto check?
		if(scan){	
			var cfg = JSON.parse(root.localStorage.generalBookmarkSetting);
			if(cfg.autocheck==true){
				$('.scan-all').click();	
			}
		}
		//scroll
		optScroll();

	}

	//Bind
//	refreshRightPanel($('.bookmarkTr:first'));
	$('.bookmarkTd.name:first').click();
	fillStat();
	fillRecents();
}

function openSite(name){
			root.sqlQuery('name, address', 'sites', function(res){
				console.log(res);
				chrome.tabs.create({url:res[0].address});
			}, "where name='" + name +"';");
}

function fillStat(){
	var stats = {'read_done':0,'reading':0,'dropped':0};
	syncStat(false);
	$('.profile-number.reading').html($('.bookmarkTr').length);
	syncStat(true);
}

function syncStat(dir){
	var stats = {'read_done':0,'reading':0,'dropped':0};
	
	if(dir){
		stats.read_done = $('.profile-number.read_done').html();
		stats.reading = $('.profile-number.reading').html();
		stats.dropped = $('.profile-number.dropped').html();
		root.localStorage.stats = JSON.stringify(stats);	
	} else {
		if(typeof(root.localStorage.stats)=='undefined'){
			root.localStorage.stats = '{"read_done":"0","reading":"0","dropped":"0"}';
		}
		stats = JSON.parse(root.localStorage.stats);
		$('.profile-number.reading').html(stats.reading);
		$('.profile-number.read_done').html(stats.read_done);
		$('.profile-number.dropped').html(stats.dropped);
	}
}
