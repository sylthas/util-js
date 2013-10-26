// 字符 			替换文本
// $1、$2、...、$99 	           与 regexp 中的第 1 到第 99 个子表达式相匹配的文本。
// $& 			           与 regexp 相匹配的子串。
// $` 			           位于匹配子串左侧的文本。
// $' 			           位于匹配子串右侧的文本。
// $$ 			           直接量符号。

function tool() {}
tool.prototype = {
	fmts: function(s) {
		var args = arguments;
		s = s.replace(/\{(\d+)\}/g, function($, $1) {
			console.info($);
			console.info($1);
			return args[+$1 + 1];
		});
		return s;
	}
}
tool = tool.prototype;