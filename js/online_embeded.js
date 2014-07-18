var middleStub = $("<div></div>");
var refTitle = "";
var refcont = "";
var reflist = [];
$(document).ready(function(){
		middleStub.load("http://rabbook.diandian.com/?tag=%E5%AE%9A%E6%9C%9F%E6%8E%A8%E8%8D%90 .jjl_title a", function(){
			var rlink = middleStub.find('a').attr('href');
			middleStub.load(rlink+" .post.text", function(){
				console.log(middleStub);
				refTitle = middleStub.find('h3.jjl_title').text();
				refcont = middleStub.find('div.jjl_body');
				reflist = refcont.find('p');
				fillRecommendList();
			});
		});
});

function fillRecommendList() {
	$('.tblre tr:gt(1)').remove();	
	reflist.each(function(i){
		var ct = reflist[i];
		$('.tblre').append('<tr></tr>');
		$('.tblre tr:last').append('<td>'+ ct.getElementsByTagName('a')[0].textContent +'</td>');
		$('.tblre tr:last').append('<td><a target="blank" href="'+ct.getElementsByTagName('a')[1].getAttribute('href')+'">'+ ct.getElementsByTagName('a')[1].textContent +'</a></td>');
		$('.tblre tr:last').append('<td><a target="blank" href="'+ct.getElementsByTagName('a')[2].getAttribute('href')+'">'+ ct.getElementsByTagName('a')[2].textContent +'</a></td>');
	});

	$('.tblre').show();
	$('body').css('background-image','none');
}
