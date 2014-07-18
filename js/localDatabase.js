function createTable(name,str,force,cbFunc){
	var db = openDatabase('rabbook', '1.0', 'rabook-db', 2 * 1024 * 1024);
	if(force){
		db.transaction(function (tx) {
		 		tx.executeSql("DROP TABLE "+ name +" ;",[],
					function(tx,rs){
			 			tx.executeSql("CREATE TABLE "+name+"("+ str +");",[],function(tx,rs){
							if(typeof(cbFunc)!='undefined'){
								cbFunc();
							}
							return;
						});
					},
					function(tx,err){
			 			tx.executeSql("CREATE TABLE "+name+"("+ str +");",[],function(tx,rs){
							if(typeof(cbFunc)!='undefined'){
								cbFunc();
							}
							return;
						});
					}
				);
		});
	} else {

		db.transaction(function (tx) {
			tx.executeSql("select count(*) from sqlite_master where name='"+name+"'",[],function(tx,rs){
				  if(rs.rows.item(0)['count(*)'] == 0) {
				  		tx.executeSql("CREATE TABLE "+name+"("+ str +");",[],function(tx,rs){
							if(typeof(cbFunc)!='undefined'){
								cbFunc();
							}
						});
				  } else {
					//判断是否需要添加某些后加入的配置项
					tx.executeSql("select * from sites limit 1",[],function(tx,rs){

						if(typeof(rs.rows.item(0).post)!='undefined'){
							if(typeof(cbFunc)!='undefined'){
								cbFunc();
							}
						} else {
							var sqlstr = "";
							if(typeof(rs.rows.item(0).post)=='undefined') {
								sqlstr = sqlstr + "alter table sites add post TEXT;";
							}
							tx.executeSql(sqlstr,[],function(tx,rs){
								if(typeof(cbFunc)!='undefined'){
									cbFunc();
								}
							});
						}
					});
				  }
			});
		});
	}
}


function initLocalDb(force,official){
	var db = openDatabase('rabbook', '1.0', 'rabook-db', 2 * 1024 * 1024);

	var config = [];
	$.merge(config,initConfig.sites);

	var sql; 
	var nameStr = "";
	for(var key in config[0]){
		if(key!="author" && key != "author_link"){
			nameStr = nameStr + key + " TEXT,";
		}
	}
	//get rid of last comma
	nameStr=nameStr.replace(/,$/g,'');
	sql = "id INTEGER PRIMARY KEY," + nameStr; 
	createTable('sites',sql,force,function(){
		var db = openDatabase('rabbook', '1.0', 'rabook-db', 2 * 1024 * 1024);
		db.transaction(function (tx) {
			tx.executeSql("select count(*) from sites where type='official'",[],function(tx,rs){
				  if(rs.rows.item(0)['count(*)'] == 0) {
						initConfigTable('all');
				  } else {
				  		if(official==true){
							initConfigTable('official');
						}
						tx.executeSql("select count(*) from sites where type='customize'",[],function(tx,rs){
				  			if(rs.rows.item(0)['count(*)'] == 0) {
									initConfigTable('customize');
							}
						});
				  }
			});
		});
	});
}

function initConfigTable(type,importSites){
	for(var curcfg in importSites){
		root.refineInfo(importSites[curcfg]);
	}
	var db = openDatabase('rabbook', '1.0', 'rabook-db', 2 * 1024 * 1024);
	var config = [];
	switch(type){
		case 'customize':
			$.merge(config,JSON.parse(localStorage.customSites));
			break;
		case 'official':
			$.merge(config,initConfig.sites);
			break;
		case 'all':
			$.merge(config,initConfig.sites);
			$.merge(config,JSON.parse(localStorage.customSites));
			break;
		case 'import':
			$.merge(config,importSites);
			break;
		default:
	}

	db.transaction(function (tx) {
		var sql; 
		var prestr;

		//pre setting
		switch(type){
			case 'all':
				prestr = 'delete from sites where id > -1;';
  				tx.executeSql(prestr);
				break;
			case 'official':
				prestr = 'delete from sites where type="official";';
  				tx.executeSql(prestr);
				break;
			case 'customize':
				prestr = 'delete from sites where type="customize";';
  				tx.executeSql(prestr);
			case 'import':
				for(var i = 0;i<config.length;i++){
					sql = "delete from sites where name='"+config[i]['name']+"'"; 
	  				tx.executeSql(sql);
				}
				break;
			default:
		}
		//Check if update
		for(var i = 0;i<config.length;i++){
			var nameStr = "";
			var valueStr= "";
			//get rid of last comma
			for(var key in config[i]){
				if(key=='id') continue;
				if(key=='author') continue;
				if(key=='author_link') continue;
				nameStr = nameStr + key + ",";
				if(config[i][key]!=null) {
					valueStr = valueStr + "'" + config[i][key] + "',";
				} else {
					valueStr = valueStr + 'null,';
				}
			}
			nameStr=nameStr.replace(/,$/g,'');
			valueStr=valueStr.replace(/,$/g,'');
			sql = "insert into sites (" + nameStr + ") values (" + valueStr + ");"; 
	  		tx.executeSql(sql);
		}
	});

}

function sqlQuery(target,dbName,cbFunc, cond){
	if(typeof(cond)=='undefined') {
		cond = '';
	}
	var db = openDatabase('rabbook', '1.0', 'rabook-db', 2 * 1024 * 1024);
	var queryArray = new Array();
	db.transaction(function (tx) {
		var sql; 
		sql = 'select' + ' ' + target + ' from' + ' ' + dbName + ' ' + cond; 
  		tx.executeSql(sql,
						[],
						function(tx,result){
     						for(var i = 0; i < result.rows.length; i++) {
								queryArray.push(result.rows.item(i));
					        }
							if(typeof(cbFunc)!='undefined'){
								cbFunc(queryArray);
							}
						},
						function(tx,err){
							console.log(err);
							if(typeof(cbFunc)!='undefined'){
								cbFunc(queryArray);
							}
						}
		);
	});
}

function sqlExec(sqlStr, cbFunc){
	var db = openDatabase('rabbook', '1.0', 'rabook-db', 2 * 1024 * 1024);
	var sqlResult = null;
	db.transaction(function (tx) {
  		tx.executeSql(sqlStr,
						[],
						function(tx,result){
							sqlResult = result;
							if(typeof(cbFunc)!='undefined'){
								cbFunc(sqlResult);
							}
						},
						function(tx,err){
							console.log(err);
							if(typeof(cbFunc)!='undefined'){
								cbFunc(sqlResult);
							}
						}
		);
	});
}

//Special actions 
function resetAllTypes(CB){
	var db = openDatabase('rabbook', '1.0', 'rabook-db', 2 * 1024 * 1024);
	db.transaction(function (tx) {
		var sql; 
		sql = 'update sites SET type="customize" where url_reg != "" ';
  		tx.executeSql(sql,
						[],
						function(tx,result){
							if(typeof(CB)!='undefined'){
								CB(result);
							}
						},
						function(tx,err){
							console.log(err);
							if(typeof(CB)!='undefined'){
								CB(result);
							}
						}
		);
	});
}
