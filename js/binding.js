function backgroundMsgBinding(){
	chrome.extension.onConnect.addListener(function(port) {
		  	switch(port.name){
			  	case 'raw_page':
					entryTabPort = port;
					entryTab = port.sender.tab;
					entryTabPort.onMessage.addListener(function(msg) {
						//console.log(msg);
						switch(msg.message){
							case 'dataFetch': //数据取回来了
								entryData = msg.value;
								entryBusy = false;
								break;
							default:
						}
					});
					entryTabPort.onDisconnect.addListener(function(){
						entryTabPort = null;
						entryTab = null;
					});
					break;
			  	case 'reader_page':
					readerTabPort = port;
					readerTab = port.sender.tab;
					setTimeout(function(){readerTabPort.postMessage({message:'refresh content'});},0); //Logically Serialize the Action
					readerTabPort.onMessage.addListener(function(msg) {
						switch(msg.message){
							case 'prepare done':
								if(bookMarkTabPort!=null){
									bookMarkTabPort.postMessage({message:"prepare done"});
								}
								break;
							default:
						}
					});
					readerTabPort.onDisconnect.addListener(function(){
						readerTabPort = null;
						readerTab = null;
						chrome.tts.stop();
					});
					break;
			  	case 'bookmark_page':
					bookMarkTabPort = port;
					bookMarkTab =  port.sender.tab;
					bookMarkTabPort.onDisconnect.addListener(function(){
						bookMarkTabPort = null;
						bookMarkTab = null;
					});
					break;
			  	default:
			}
	});
}

//沙箱处理
function sandBoxProceed(msg){
//	var msg = {
//		command:'eval',
//		parameters: { 'list': [
//			{'name':'A', 'value':'"ValueA"'}
//		], 'evalScript':"console.log(A);"}
//	};
 	var iframe = document.getElementById('theFrame');
 	iframe.contentWindow.postMessage(msg, '*');
};


// Set up message event handler:

window.addEventListener('message', function(event) {
  var command = event.data.command;
  var evalResult = event.data.evalResult;
  switch(command) {
    case 'eval content patch result':
		sandboxResult = evalResult;
    break;
    case 'eval update patch result':
		var index = event.data.index;
		updateSandbox[index] = evalResult;
    break;
    case 'do regular exp result':
		sandboxResult = evalResult;
		if(sandboxResult==null) sandboxResult = "NA";
    break;
    case 'do regular replace result':
		sandboxResult = evalResult;
		if(sandboxResult==null) sandboxResult = "NA";
    break;
	default:
		sandboxResult = evalResult;
		if(sandboxResult==null) sandboxResult = "NA";
	break;
  }
});

chrome.notifications.onClicked.addListener (function(nid){
	switch(nid) {
		case 'update-notify':
			chrome.tabs.create({url:'updateinfo.html'});
			break;	
		case 'update-notify-small':
			chrome.tabs.create({url:'whatsnew.html'});
			break;	
		default:
			break;
	}
	chrome.notifications.clear(nid,function(){});
});

