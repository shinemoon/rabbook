// Note: The file system has been prefixed as of Google Chrome 12:
window.requestFileSystem  = window.requestFileSystem || window.webkitRequestFileSystem;

function checkDataStatus(type){
	$('.loader-span').removeClass('stop').addClass('run');
	if(type === "kuaipan") {
	  var url = 'http://openapi.kuaipan.cn/1/metadata/app_folder/rabbook/data.txt';
	  var request = {
	    'method': 'GET',
	    'format': 'JSON'
	  };
	  try{
	  	if(typeof(syn)=='undefined') {
  	  		root.oauth.sendSignedRequest(url, checkDataStatusCB,null,'kuaipan');
		} else {
  	  		root.oauth.sendSignedRequest(url, checkDataStatusCB,null,'kuaipan','true');
		}
	  }
	  catch(err){
	  }
		
	}
}

function checkDataStatusCB(resp, xhr, type) {
  // ... Process text response ...
  var respJson = JSON.parse(resp);
  if(respJson.msg && respJson.msg==="check sign error") {
  	if(type ==='kuaipan') {
  		localStorage.removeItem('oauth_tokenhttp://www.kuaipan.cn/');
  		localStorage.removeItem('oauth_token_secrethttp://www.kuaipan.cn/');
	}
	$('.loader-span').removeClass('run').addClass('stop');
	authorToken(type);
  } else {
  	//Handle user Info:
	if(type==='kuaipan') {
		data = JSON.parse(xhr.responseText);
		if(data.statusText == 'Not Found'){
			chrome.storage.local.set({'datasynchistory':{'lastupdatetime':'从未', 'lastsize':'不详'}});
			chrome.storage.local.set({'datasynchistory':{}});
		} else {
			chrome.storage.local.set({'datasynchistory':{'lastupdatetime':data.modify_time, 'lastsize':data.size/1000 + " KB" }});
			if(root.syncing == true) {
				chrome.storage.local.set({'localConfigTimestamp':data.modify_time});
				root.syncing = false;
			} 
		}
		syncStatus('sync-status');
	}
  }
};

function uploadConfigFile(type){
	$('.loader-span').removeClass('stop').addClass('run');
	if(type === "kuaipan") {
	  var url = 'http://openapi.kuaipan.cn/1/fileops/create_folder/app_folder/rabbook';
	  var request = {
	    'method': 'GET',
	    'format': 'JSON'
	  };
	  try{
	  	if(typeof(syn)=='undefined') {
  	  		root.oauth.sendSignedRequest(url, uploadConfigFileCB,null,'kuaipan');
		} else {
  	  		root.oauth.sendSignedRequest(url, uploadConfigFileCB,null,'kuaipan','true');
		}
	  }
	  catch(err){
	  }
	}
}

function uploadConfigFileCB(resp, xhr, type) {
  // ... Process text response ...
  var respJson = JSON.parse(resp);
  if(respJson.msg && respJson.msg==="check sign error") {
  	if(type ==='kuaipan') {
  		localStorage.removeItem('oauth_tokenhttp://www.kuaipan.cn/');
  		localStorage.removeItem('oauth_token_secrethttp://www.kuaipan.cn/');
	}
	$('.loader-span').removeClass('run').addClass('stop');
	authorToken(type);
  } else {
  	//Handle user Info:
	if(type==='kuaipan') {
		data = JSON.parse(xhr.responseText);
		if(data.msg == 'ok'){
			//Upload file implementation	
			generateConfigFile();
		} else {
			notify("上传失败请再试!", 'new');
		}
	}
  }
};


function generateConfigFile(){
	window.webkitRequestFileSystem(window.TEMPORARY, 8*1024*1024 /*8MB*/, onDataConfigFsGen, errorHandler);
}

function onDataConfigFsGen(fs) {
  	root.fs = fs;
   // Create a FileWriter object for our FileEntry (log.txt).
	root.fs.root.getFile('data.txt', {create: true}, function(fileEntry) {

    // Create a FileWriter object for our FileEntry (log.txt).
    fileEntry.createWriter(function(fileWriter) {

      fileWriter.onwriteend = function(e) {
      };

      fileWriter.onerror = function(e) {
        console.log('Write failed: ' + e.toString());
      };
      // Create a new Blob and write it to log.txt.
	  //export all sites cfg
	  root.sqlQuery('*','sites',function(ret){
	  		//Get the site config and then need to add skin setting;
			var cfg = JSON.parse(root.localStorage.generalSkinSetting);
			if(typeof(cfg.customize)=='undefined'){
				cfg['customize']="";
			}
			var textStr = JSON.stringify([ret,cfg.customize]); //站点配置+皮肤配置
			textStr = textStr.replace(/,/g,',\n');
			textStr = textStr.replace(/{/g,'{\n');
			root.fileBuffer = textStr;
			//var blob = new Blob([textStr], {type: 'text/plain'});
			//fileWriter.write(blob);
			//记录时间
			var tdate = new Date();
			var dateStr	=	"";
			dateStr = dateStr + tdate.getFullYear() + "-" + Number(tdate.getMonth()+1) + "-" + tdate.getDate() + " " + tdate.toLocaleTimeString();
			chrome.storage.local.set({'localConfigTimestamp':dateStr});

			//尝试上传文件
			sendFile('kuaipan','config');
			//}," where type='customize'");
			}," where id!=-1");
    }, errorHandler);

  }, errorHandler);
}


function errorHandler(e) {
  var msg = '';

  switch (e.code) {
    case FileError.QUOTA_EXCEEDED_ERR:
      msg = 'QUOTA_EXCEEDED_ERR';
      break;
    case FileError.NOT_FOUND_ERR:
      msg = 'NOT_FOUND_ERR';
      break;
    case FileError.SECURITY_ERR:
      msg = 'SECURITY_ERR';
      break;
    case FileError.INVALID_MODIFICATION_ERR:
      msg = 'INVALID_MODIFICATION_ERR';
      break;
    case FileError.INVALID_STATE_ERR:
      msg = 'INVALID_STATE_ERR';
      break;
    default:
      msg = 'Unknown Error';
      break;
  };

  console.log('Error: ' + msg);
}

function sendFile(type, cate){
	$('.loader-span').removeClass('stop').addClass('run');
	//Get Locale
	if(type === "kuaipan") {
	  var url = 'http://api-content.dfs.kuaipan.cn/1/fileops/upload_locate';
	  var request = {
	    'method': 'GET',
	    'format': 'JSON'
	  };
	  try{
	  	if(typeof(syn)=='undefined') {
			if(cate == 'config') {
  	  			root.oauth.sendSignedRequest(url, sendConfigFileCB,null,'kuaipan');
			} else if(cate == 'bookmark'){
  	  			root.oauth.sendSignedRequest(url, sendBookmarkFileCB,null,'kuaipan');
			}
		} else {
			if(cate == 'config') {
  	  			root.oauth.sendSignedRequest(url, sendConfigmarkFileCB,null,'kuaipan',true);
			} else if(cate == 'bookmark'){
  	  			root.oauth.sendSignedRequest(url, sendBookmarkFileCB,null,'kuaipan',true);
			}

		}
	  }
	  catch(err){
	  }
	}
}

function sendConfigFileCB(resp,xhr,type){
	sendFileLocCB(resp,xhr,type,'config');
}
function sendBookmarkFileCB(resp,xhr,type){
	sendFileLocCB(resp,xhr,type,'bookmark');
}
function sendFileLocCB(resp, xhr, type, cate) {

  var filename = "";
  if(cate=="config") filename = "data.txt";
  if(cate=="bookmark") filename = "bookmark.txt";

  // ... Process text response ...
  var respJson = JSON.parse(resp);
  var uploadurl = null;
  if(respJson.msg && respJson.msg==="check sign error") {
  	if(type ==='kuaipan') {
  		localStorage.removeItem('oauth_tokenhttp://www.kuaipan.cn/');
  		localStorage.removeItem('oauth_token_secrethttp://www.kuaipan.cn/');
	}
	$('.loader-span').removeClass('run').addClass('stop');
	authorToken(type);
  } else {
  	//Handle user Info:
	if(type==='kuaipan') {
		data = JSON.parse(xhr.responseText);
		if(data.stat == 'OK'){
			uploadurl	=	data.url;
			var bodyContent = '';
			var headers = {
					"Content-Type":"multipart/form-data; boundary=----------ThIs_Is_tHe_bouNdaRY_$"
			};
			//Read File:

 			root.fs.root.getFile(filename, {}, function(fileEntry) {
		    // Get a File object representing the file,
		    // then use FileReader to read its contents.
		    fileEntry.file(function(file) {
//		       var reader = new FileReader();
//		       reader.onloadend = function(e) {
					//组装文件
				bodyContent += "------------ThIs_Is_tHe_bouNdaRY_$\r\n";
				bodyContent += 'Content-Disposition: form-data; name="fileData"; filename="'+filename+'"\r\n';
				bodyContent += "Content-Type: text/plain\r\n";
				bodyContent += "\r\n";
				bodyContent += root.fileBuffer;
				bodyContent += "\r\n";
				bodyContent += "------------ThIs_Is_tHe_bouNdaRY_$--\r\n";
				if(type === "kuaipan") {
				  var url = uploadurl+'/1/fileops/upload_file';
				  var request = {
				    'method': 'POST',
					'parameters':{
								    'overwrite': 'True',
									'root':	'app_folder',
									'path':'rabbook/'+filename,
								},
				    'body': bodyContent,
					'headers':headers
				  };
				  try{
				  	if(typeof(syn)=='undefined') {
			  	  		root.oauth.sendSignedRequest(url, sendFileDoneCB,request,'kuaipan');
					} else {
			  	  		root.oauth.sendSignedRequest(url, sendFileDoneCB,request,'kuaipan','true');
					}
				  }
				  catch(err){
				  }
				}
		       //};
		       //reader.readAsText(file);
		     }, errorHandler);
			}, errorHandler);
			

		} else {
			notify("上传失败请再试!", 'new');
		}
	}
  }
};



function sendFileDoneCB(resp, xhr, type) {
  var respJson = JSON.parse(resp);
  if(respJson.msg && respJson.msg==="check sign error") {
  	if(type ==='kuaipan') {
  		localStorage.removeItem('oauth_tokenhttp://www.kuaipan.cn/');
  		localStorage.removeItem('oauth_token_secrethttp://www.kuaipan.cn/');
	}
	console.log('Authorize Failed, Please ReTry!');
	$('.loader-span').removeClass('run').addClass('stop');
	authorToken(type);
  } else {
  	//Handle user Info:
	if(type==='kuaipan') {
		data = JSON.parse(xhr.responseText);
		if(xhr.status == '200'){
			root.syncing = true;
			notify("同步完成!", 'new');

			checkDataStatus('kuaipan');
		} else {
			notify("同步失败请再试!", 'new');
		}
		syncStatus('sync-status');
	}
  }
};

function downloadConfigFile(type){
	$('.loader-span').removeClass('stop').addClass('run');
	//Get Locale
	if(type === "kuaipan") {
	  var url = 'http://api-content.dfs.kuaipan.cn/1/fileops/download_file';
	  var request = {
	    'method': 'GET',
		'parameters':{
						'root':	'app_folder',
						'path':'rabbook/data.txt'
					}
	  };
	  try{
	  	if(typeof(syn)=='undefined') {
  	  		root.oauth.sendSignedRequest(url, readFileCB,request,'kuaipan');
		} else {
  	  		root.oauth.sendSignedRequest(url, readFileCB,request,'kuaipan','true');
		}
	  }
	  catch(err){
	  }
	}

}

function readFileCB(resp, xhr, type){
  if(xhr.status == "401") {
  	if(type ==='kuaipan') {
  		localStorage.removeItem('oauth_tokenhttp://www.kuaipan.cn/');
  		localStorage.removeItem('oauth_token_secrethttp://www.kuaipan.cn/');
	}
	console.log('Authorize Failed, Please ReTry!');
	$('.loader-span').removeClass('run').addClass('stop');
	authorToken(type);
  } else {
  	//Handle user Info:
	if(type==='kuaipan') {
		data = xhr.response;
		if(xhr.status == '200'){
			root.syncing = true;
			//恢复配置
			recoverCloudSetting(data,function(){
				checkDataStatus('kuaipan');
			});
		} else {
			notify("恢复失败请再试!", 'new');
		}
		syncStatus('sync-status');
	}
  }
}

function recoverCloudSetting(data, CB){
	var configStr = data;
	configStr = configStr.replace(/\n/g,'');
	var configs = JSON.parse(configStr);
	//Bookmarks import
	root.initConfigTable('import',configs[0]);
	//Skin Import
	var cfg = JSON.parse(root.localStorage.generalSkinSetting);
	if(typeof(cfg.customize)=='undefined'){
		cfg['customize']="";
	}
	cfg.customize = configs[1];
	//root.refineInfo(cfg);
	root.localStorage.generalSkinSetting = JSON.stringify(cfg);

	var alertStr = "成功导入"+(configs[0].length-2)+"条站点配置以及自定义皮肤!";
	notify(alertStr, 'new');
	if(typeof(CB)!='undefined') {
		CB();
	}
}


function uploadBookmarkFile(type){
	$('.loader-span').removeClass('stop').addClass('run');
	if(type === "kuaipan") {
	  var url = 'http://openapi.kuaipan.cn/1/fileops/create_folder/app_folder/rabbook';
	  var request = {
	    'method': 'GET',
	    'format': 'JSON'
	  };
	  try{
	  	if(typeof(syn)=='undefined') {
  	  		root.oauth.sendSignedRequest(url, uploadBookmarkFileCB,null,'kuaipan');
		} else {
  	  		root.oauth.sendSignedRequest(url, uploadBookmarkFileCB,null,'kuaipan','true');
		}
	  }
	  catch(err){
	  }
	}
}

function downBookmarkFile(type){
	$('.loader-span').removeClass('stop').addClass('run');
	//Get Locale
	if(type === "kuaipan") {
	  var url = 'http://api-content.dfs.kuaipan.cn/1/fileops/download_file';
	  var request = {
	    'method': 'GET',
		'parameters':{
						'root':	'app_folder',
						'path':'rabbook/bookmark.txt'
					}
	  };
	  try{
	  	if(typeof(syn)=='undefined') {
  	  		root.oauth.sendSignedRequest(url, readBookmarkCB,request,'kuaipan');
		} else {
  	  		root.oauth.sendSignedRequest(url, readBookmarkCB,request,'kuaipan','true');
		}
	  }
	  catch(err){
	  }
	}

}

function readBookmarkCB(resp, xhr, type){
  if(xhr.status == "401") {
  	if(type ==='kuaipan') {
  		localStorage.removeItem('oauth_tokenhttp://www.kuaipan.cn/');
  		localStorage.removeItem('oauth_token_secrethttp://www.kuaipan.cn/');
	}
	console.log('Authorize Failed, Please ReTry!');
	$('.loader-span').removeClass('run').addClass('stop');
	authorToken(type);
  } else {
  	//Handle user Info:
	if(type==='kuaipan') {
		data = xhr.response;
		if(xhr.status == '200'){
			root.syncing = true;
			//恢复配置
			recoverBookmark(data,function(){
				checkDataStatus('kuaipan');
			});
		} else {
			notify("恢复失败请再试!", 'new');
		}
		syncStatus('sync-status');
	}
  }
}

function recoverBookmark(data, CB){
	var configStr = data;
//	temp='{"bookmarks":' + configStr + '}';
	//configStr = configStr.replace(/\n/g,'');
	var configs = JSON.parse(data);
	var dirId = root.dirId;
	//Bookmarks import
	//先清空列表
	if(dirId!=null){
		chrome.bookmarks.removeTree(dirId, function (){
			for (var i = 1 ;i< configs.length; i++){
				function pendingBookmark(index){
					if(root.bookmarkbusy) {
						setTimeout(function(){
							pendingBookmark(index);
						}, 20);
					} else {
						root.addBookmark(configs[index],'import');
					}
				}
				pendingBookmark(i);
			}
		
			var alertStr = "成功导入"+(configs.length-1)+"条书签!";
			notify(alertStr, 'new');
			if(typeof(CB)!='undefined') {
				CB();
			}
		});
	} else {
		for (var i = 1 ;i< configs.length; i++){
			function pendingBookmark(index){
				if(root.bookmarkbusy) {
					setTimeout(function(){
						pendingBookmark(index);
					}, 20);
				} else {
					root.addBookmark(configs[index],'import');
				}
			}
			pendingBookmark(i);
		}
		
		var alertStr = "成功导入"+(configs.length-1)+"条书签!";
		notify(alertStr, 'new');
		if(typeof(CB)!='undefined') {
			CB();
		}
	}

}


function uploadBookmarkFileCB(resp, xhr, type) {
  // ... Process text response ...
  var respJson = JSON.parse(resp);
  if(respJson.msg && respJson.msg==="check sign error") {
  	if(type ==='kuaipan') {
  		localStorage.removeItem('oauth_tokenhttp://www.kuaipan.cn/');
  		localStorage.removeItem('oauth_token_secrethttp://www.kuaipan.cn/');
	}
	console.log('Authorize Failed, Please ReTry!');
	$('.loader-span').removeClass('run').addClass('stop');
	authorToken(type);
  } else {
  	//Handle user Info:
	if(type==='kuaipan') {
		data = JSON.parse(xhr.responseText);
		if(data.msg == 'ok'){
			//Upload file implementation	
			generateBookmarkFile();
		} else {
			notify("上传失败请再试!", 'new');
		}
	}
  }
};


function generateBookmarkFile(){
	window.webkitRequestFileSystem(window.TEMPORARY, 8*1024*1024 /*8MB*/, onDataBookmarkFsGen, errorHandler);
}

function onDataBookmarkFsGen(fs) {
  	root.fs = fs;
   // Create a FileWriter object for our FileEntry (log.txt).
	root.fs.root.getFile('bookmark.txt', {create: true}, function(fileEntry) {

    // Create a FileWriter object for our FileEntry (log.txt).
    fileEntry.createWriter(function(fileWriter) {

      fileWriter.onwriteend = function(e) {
      };

      fileWriter.onerror = function(e) {
        console.log('Write failed: ' + e.toString());
      };
      // Create a new Blob and write it to log.txt.

		//root.fetchBookmarks(function(list){fillBookmarks(list);});
	root.fetchBookmarks(function(list){
		var textStr = JSON.stringify(list);
		root.fileBuffer = textStr;
		//var blob = new Blob([textStr], {type: 'text/plain'});
		//fileWriter.write(blob);
		//记录时间
		var tdate = new Date();
		var dateStr	=	"";
		dateStr = dateStr + tdate.getFullYear() + "-" + Number(tdate.getMonth()+1) + "-" + tdate.getDate() + " " + tdate.toLocaleTimeString();
		chrome.storage.local.set({'localBookmarkTimestamp':dateStr});
		//尝试上传文件
		sendFile('kuaipan','bookmark');
	});
    }, errorHandler);
 });
}



