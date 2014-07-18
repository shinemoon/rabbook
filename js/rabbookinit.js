//通用配置
//阅读配置
if(typeof(localStorage.generalReaderSetting)=='undefined'){
//	localStorage.generalReaderSetting = '{"autopage":"true","shortkeystyle":"normal","autoscroll":"scrolldown", "autoclose":"disable", "clickpage":"enable"}';
	localStorage.generalReaderSetting = '{"autopage":"true","autobookmark":"false","clockshow":"true","shortkeystyle":"normal","autoscroll":"scrolldown", "autoclose":"disable", "enableWeibo":"enabled"}';
}

//书签配置
if(typeof(localStorage.generalBookmarkSetting)=='undefined'){
	localStorage.generalBookmarkSetting = '{"autocheck":"false"}';
}
//皮肤配置
if(typeof(localStorage.generalSkinSetting)=='undefined'){
	localStorage.generalSkinSetting = '{"skin":"default","customize":""}';
}

//站点配置
if(typeof(localStorage.customSites)=='undefined'){
	localStorage.customSites = JSON.stringify(initConfigCustomSites); 
}
//Debug
localStorage.customSites = JSON.stringify(initConfigCustomSites); 

