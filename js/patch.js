function applyPatch(cbFunc){
	switch(curSiteConfig.patch){
		default:
			patchCustom(cbFunc);
	}
}
function patchCustom(cbFunc){
		var async = false;
		if(typeof(curSiteConfig.content_patch)!='undefined' && curSiteConfig.content_patch != null & curSiteConfig.content_patch!=''){
		//Can't use eval directly anymore
			var msg = {
				command:'eval content patch',
				parameters: { 'list': [
					{'name':'fakeStub', 'value':fakeStub.html()}
				], 'evalScript':curSiteConfig.content_patch}
			};
			sandBoxProceed(msg);
			//因为沙箱操作(至少针对eval)
			function waitforContentSandBox()
			{   
			   if(sandboxResult==null) {
			   		setTimeout(function(){
							waitforContentSandBox();
					},20);
			   } else {
					fakeStub.html(sandboxResult);
					//Do loader task post
					var postloaders = fakeStub.find(".post-load-rabbook");
					//循环载入待load数据
					function loopLoader (arr, index, upper) {
						if(index<upper) {
							xmlHandler.onreadystatechange = function () {
								console.log(xmlHandler);
								var content = null;
							 	if(xmlHandler.readyState == 4 && xmlHandler.status == 200) {
									switch(curSiteConfig.address){
										case "http://www.qidian.com/": //Qidian
											arr.eq(index).html(patchQidian(xmlHandler.responseText));
											break;
										case "http://chuangshi.qq.com/"://Chuangshi
											arr.eq(index).html(patchChuangshi(xmlHandler.responseText));
											break;
										case "http://book.hjsm.tom.com/"://Hjsm
											arr.eq(index).html(patchHjsm(xmlHandler.responseText,index));
											break;
										default:
											arr.eq(index).html(content);
											break;
									}
									loopLoader(arr, ++index, upper);
								} else if(xmlHandler.readyState == 4 && xmlHandler.status != 200) {
								}	
							};
							xmlHandler.open('GET', arr.eq(index).text(), true);
							if(arr.eq(index).attr('charset')) {
								if(xmlHandler.overrideMimeType)	{
									xmlHandler.overrideMimeType('text/html;charset='+ arr.eq(index).attr('charset'));
								}	
							}
							xmlHandler.send();
						} else {
							sandboxResult = null;
							if(async==false){
								cbFunc();
							}
						}
					}
					loopLoader(postloaders, 0, postloaders.length);
			   }
			}
			waitforContentSandBox();
		} else {
			cbFunc();
		}
}

function applyPatchUpdate(config,stub,index,cbFunc){
	switch(config.patch){
		default:
			patchCustomUpdate(config,stub,index,cbFunc);
	}
}

function patchCustomUpdate(config,stub,index,cbFunc){
	stub.text(stub.text().replace(/[\r\n]/g,''));
	stub.text(stub.text().replace(/^\s*/g,''));
	stub.text(stub.text().replace(/\s*$/g,''));
	if(typeof(config.update_patch)!='undefined' && config.update_patch != null ){
		//Can't use eval directly anymore
		var msg = {
			command:'eval update patch',
			index: index,
			parameters: { 'list': [
				{'name':'stub', 'value':stub.html()}
			], 'evalScript':config.update_patch}
		};
		sandBoxProceed(msg);
		//因为沙箱操作(至少针对eval)
		function waitforSandBox(index)
		{   
		   if(typeof(updateSandbox[index])=='undefined') {
		   		setTimeout(function(){
						waitforSandBox(index);
				},20);
		   } else {
		   		stub = $("<div><a>"+updateSandbox[index]+"</a></div>");
				cbFunc(stub,index);
		   }
		}
		waitforSandBox(index);
	}
}

