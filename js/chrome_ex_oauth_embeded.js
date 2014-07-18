      function onLoad() {
        ChromeExOAuth.initCallbackPage(function(token,secret){
					console.log(token);
			});
		chrome.extension.getBackgroundPage().refreshFlag=1;
      };

	  window.onload = function(){
	  	onLoad();
	  };

