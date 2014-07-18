
/**上一章，下一章**/
function goChapter(c,chapterUrlArr){
	if (typeof(chapterUrlArr)=='undefined') return false;
    var index = $.inArray(root.curUrl, chapterUrlArr);
    if (c=='pre') {
    	i = index-1;
    } else if (c=='next') {
    	i = index + 1;
    }
    if(index != -1){
    	//如果为第一章
    	if (i == -1) {
			return false;
    	} 
        var Url = chapterUrlArr[i];
        //如果为最后一章
        var l = $.inArray(Url, chapterUrlArr);
        if (l == -1) {
        	return false;
        }
		return Url;
    }   
    return false;		
} 

function patchHjsm(content,index) {
	switch(index){
		case 0:	//content
			content = content.replace(/.*document\.write\("(.*)"\).*/, '$1');
			content = unescape(content.replace(/\\u/gi,'%u'));
			content = content.replace(/<\\\/p>/gi,'</p>');
			content = content.replace(/\\n/gi,'\n');
			return content;
			break;
		case 1://navigation
			var chapterstr = content.match(/var chapterUrlArr\s*=(.*);/)[1];
			//chapterstr =  chapterstr.replace(/"/gi, '\\"');
			chapterstr = "{\"chapterlist\":"+chapterstr+"}"; 
			var chapters = JSON.parse(chapterstr);
			var pre = goChapter('pre',chapters.chapterlist);
			var next = goChapter('next',chapters.chapterlist);
			var navstub=$("<div></div>");
			navstub.append('<a id=preChapterCtrl href="'+pre+'"></a>');
			navstub.append('<a id=nextChapterCtrl href="'+next+'"></a>');
			return navstub.html();
			break;
		default:
			break;
	}
}

