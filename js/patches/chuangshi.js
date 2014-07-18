function _getChapterIdList(vjson){
		if(!vjson){
			return null;
		}
		var cid_list={},chapter_list=[];
		$(vjson).each(function(volumeIndex,volume){
				$(volume.chapters).each(function(chapterIndex,chapter){
					chapter_list.push(chapter.CID);
				});
		});
		var len=chapter_list.length;
		$(chapter_list).each(function(index,cid){
		var pre_cid=0,next_cid=0;
		if(index-1>=0){
			pre_cid=chapter_list[index-1];
		}
		if(index+1<len){
			next_cid=chapter_list[index+1];
		}
		cid_list[cid]={
			'pre_cid':pre_cid,'next_cid':next_cid};
		});
		return cid_list;
}

function getPreCID(current_cid,vjson){
			var _cid_list;
			if(!_cid_list){
				_cid_list=_getChapterIdList(vjson);
			}
			if(!_cid_list||!_cid_list[current_cid]){
				return 0;
			}
			return _cid_list[current_cid].pre_cid;
}

function getNextCID(current_cid,vjson){
			var _cid_list;
			if(!_cid_list){
				_cid_list=_getChapterIdList(vjson);
			}
			if(!_cid_list||!_cid_list[current_cid]){
				return 0;
			}
			return _cid_list[current_cid].next_cid;
}

function patchChuangshi(content) {
			content = JSON.parse(content);
			content = content.Content;
			var stub = $('<div></div>');
			stub.html(content);
			stub.find('h1').remove();
			stub.find('.textinfo').remove();
			stub.find('p:last').remove();
			stub.find('.writer').remove();
			//chapterhandle
			var cid = fakeStub.find('#cid').text();
			var iid = fakeStub.find('#iid').text();
			var list = JSON.parse(fakeStub.find('#cidlist').text());
			var ncid = getNextCID(cid,list);
			var pcid = getPreCID(cid,list);
			fakeStub.append("<a id=prechapter href='http://chuangshi.qq.com/read/bookreader/"+pcid+".html'></a>");
			fakeStub.append("<a id=nextchapter href='http://chuangshi.qq.com/read/bookreader/"+ncid+".html'></a>");
			fakeStub.append("<a id=index href='http://chuangshi.qq.com/read/novel/listContents/showid/"+iid+".html'></a>");

			//
			return stub.html();
}
