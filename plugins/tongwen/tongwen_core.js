/****************************
 * Node Types http://www.w3schools.com/dom/dom_nodetype.asp
 * NodeType Named Constant
 * 1   ELEMENT_NODE
 * 2   ATTRIBUTE_NODE
 * 3   TEXT_NODE
 * 4   CDATA_SECTION_NODE
 * 5   ENTITY_REFERENCE_NODE
 * 6   ENTITY_NODE
 * 7   PROCESSING_INSTRUCTION_NODE
 * 8   COMMENT_NODE
 * 9   DOCUMENT_NODE
 * 10  DOCUMENT_TYPE_NODE
 * 11  DOCUMENT_FRAGMENT_NODE
 * 12  NOTATION_NODE
 ****************************/

// code from https://developer.mozilla.org/en/JavaScript/Reference/Global_Objects/Array/indexOf
if (!Array.prototype.indexOf) {
	Array.prototype.indexOf = function (searchElement /*, fromIndex */) {
		"use strict";
		if (this == null) {
			throw new TypeError();
		}
		var t = Object(this);
		var len = t.length >>> 0;
		if (len === 0) {
			return -1;
		}
		var n = 0;
		if (arguments.length > 0) {
			n = Number(arguments[1]);
			if (n != n) { // shortcut for verifying if it's NaN
				n = 0;
			} else if (n != 0 && n != Infinity && n != -Infinity) {
				n = (n > 0 || -1) * Math.floor(Math.abs(n));
			}
		}
		if (n >= len) {
			return -1;
		}
		var k = n >= 0 ? n : Math.max(len - Math.abs(n), 0);
		for (; k < len; k++) {
			if (k in t && t[k] === searchElement) {
				return k;
			}
		}
		return -1;
	}
}

var TongWen = (function () {
	"use strict";
	var
		version  = '0.4',       // 版本

		flagSimp = 'simplified',  // 簡體
		flagTrad = 'traditional', // 繁體

		zhEncodesSimp = ['gb2312', 'gbk', 'x-gbk', 'gb18030', 'hz-gb-2312', 'iso-2022-cn'],
		zhEncodesTrad = ['big5', 'big5-hkscs', 'x-euc-tw'],

		enableFontset = false,
		fontTrad      = 'PMingLiU,MingLiU,新細明體,細明體',
		fontSimp      = 'MS Song,宋体,SimSun',

		t2s = {},                 // 繁轉簡 對照表
		s2t = {},                 // 簡轉繁 對照表

		maxSTLen = 1,             // 簡轉繁 最長的詞句
		maxTSLen = 1,             // 繁轉簡 最長的詞句

		curZhFlag = '',           // 目前網頁編碼
		styleIdx  = 0,            // 樣式索引
		debug     = false;

// =============================================================================
// =============================================================================

	// 新增 簡轉繁 對照表
	function addS2TTable(table) {
		var i;
		for (i in table) {
			if (table.hasOwnProperty(i)) {
				maxSTLen = Math.max(maxSTLen, table[i].length);
				s2t[i] = table[i];
			}
		}
	}

	// 新增 繁轉簡 對照表
	function addT2STable(table) {
		var i;
		for (i in table) {
			if (table.hasOwnProperty(i)) {
				maxTSLen = Math.max(maxTSLen, table[i].length);
				t2s[i] = table[i];
			}
		}
	}


	// 繁簡轉換
	function convert(str, zhflag) {
		var
			leng = 4, zmap = null, i, j, c,
			txt, s, bol;

		if (zhflag === flagSimp) {
			// 繁轉簡
			zmap = t2s;
			leng = Math.min(maxTSLen, str.length);
		} else {
			// 簡轉繁
			zmap = s2t;
			leng = Math.min(maxSTLen, str.length);
		}

		// 單字轉換
		str = str.split('');
		for (i = 0, c = str.length; i < c; i += 1) {
			str[i] = zmap[str[i]] || str[i];
		}
		str = str.join('');

		// 詞彙轉換
		txt = '';
		s = '';
		bol = true;
		for (i = 0, c = str.length; i < c;) {
			bol = true;
			for (j = leng; j > 1; j -= 1) {
				s = str.substr(i, j);
				if (s in zmap) {
					txt += zmap[s];
					i += j;
					bol = false;
					break;
				}
			}

			if (bol) {
				txt += str.substr(i, 1);
				i += 1;
			}
		}
		if (txt !== '') {
			str = txt;
		}
		return str;
	}


// =============================================================================
// =============================================================================

	return {
		version            : version,
		addS2TTable        : addS2TTable,
		addT2STable        : addT2STable,
		convert            : convert
	};

}());
