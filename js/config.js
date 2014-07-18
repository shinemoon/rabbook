function notify(str,style){
	if(style=='new'){
		$('#notify').html(str).show();	
	} else if(style=='append'){
		$('#notify').html($('#notify').html() + " " + str).show();	
	}
}
