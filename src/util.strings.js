// 字符串处理类
function Strings(s) {
	if (s) {
		var args = arguments;
		return new Strings.prototype.init(args);
	}
}
Strings.prototype = {
	init: function(args) {
		this[0] = args[0] || args;
		this.data = [];
		if (args.length > 1)
			this.append.apply(this, args);
		else
			this.append(args);
		return this;
	},
	fmts: function() {
		var args = arguments;
		var s = this[0];
		this[0] = s.replace(/\{(\d+)\}/g, function($, $1) {
			return args[+$1];
		});
		return this[0];
	},
	append: function(s, o) {
		console.info(this);
		var args = arguments;
		if (args.length < 2)
			this.data.push(s || "");
		else if (typeof o == "object") {
			this.data.push(s.replace(/\$\{([\w.]+)\}/g, function($, $1) {
				return ($1 in j) ? j[$1] : $;
			}));
		} else {
			this.data.push(s.replace(/\{(\d+)\}/g, function($, $1) {
				return args[+$1 + 1];
			}));
		}
		return this;
	},
	toString: function() {
		return this.data.join("");
	}
}
Strings.prototype.init.prototype = Strings.prototype;