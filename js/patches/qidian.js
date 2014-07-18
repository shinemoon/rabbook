function patchQidian(content) {
			content = xmlHandler.responseText.replace(/.*document\.write\('(.*)'\).*/, '$1');
			content = content.replace(/\<\s*a\s+\S*>.*?\<\/a\>/g,''); //Qidian Patch for ad
			return content;
}
