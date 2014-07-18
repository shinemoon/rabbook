$(document).ready(function(){
	prettyPrint();

	$('.about-link a:first').click(function(){
		chrome.tabs.create({url:'http://tieba.baidu.com/rabbook'});
	});
	$('.about-link a:nth-child(2)').click(function(){
		chrome.tabs.create({url:'http://rabbook.diandian.com'});
	});
	$('.about-link a:nth-child(3)').click(function(){
		chrome.tabs.create({url:'http://weibo.com/claudxiao'});
	});
	//scroll
//	$('body').mCustomScrollbar({
//		mousewheel:true,
//        scrollButtons:{
//          enable:true
//	    },
//		theme:'dark-2'
//	});
		var middleStub = $("<div></div>");
		middleStub.load("http://rabbook.diandian.com .post.text:first", function(data){
			var realUrl="";
			realUrl = middleStub.find('a:first').attr('href');
			$('.middle-info .info-content').empty();
			$('.middle-info .info-content').append("<a href="+realUrl+" target=_blank></a>");
			$('.middle-info .info-content a').html(middleStub.find("a:first").text());
		});


});

