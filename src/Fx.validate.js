/**
 * Fx Form Validate Extend
 * @authors Sylthas (sylthasgg@gmail.com)
 * @date    2013-10-29 20:10:33
 * @version 1.0
 */
var validate = (function() {
	var emai_pattern = /^[a-z0-9]+([._\\-]*[a-z0-9])*@([a-z0-9]+[-a-z0-9]*[a-z0-9]+.){1,63}[a-z0-9]+$/;
	var url_pattern = /^(http|ftp|https):\/\/[\w\-_]+(\.[\w\-_]+)+([\w\-\.,@?^=%&amp;:/~\+#]*[\w\-\@?^=%&amp;/~\+#])?/;
	// 默认消息
	var messages = {
		required: "该项目必须填写",
		minlength: "该项目至少{0}个字符",
		maxlength: "该项目最多{0}个字符",
		rangelength: "该项目必须在{0}到{1}个字符之间",
		min: "该项目不能小于{0}",
		max: "该项目不能大于{0}",
		range: "该项目必须在{0}到{1}之间",
		email: "请填写正确的电子邮箱",
		url: "URL格式不正确",
		regex: "该项目格式不正确",
		equals: "该项目和{0}不一致"
	};

	function validate(opt, func) {
		var _frm = this[0];
		if (!_frm || _frm.nodeName != 'FORM') return false;
		var _json = Fx.Form.json(_frm);
		var opt = opt || {}, rules = opt.rules || {}, msgs = opt.messages || {}, func = func || function() {};
		var msg = null;
		for (var n in rules) {
			var or = rules[n];
			var v = _json[n];

			if (or.required) {
				var flg = false;
				if (typeof or.required == 'boolean') {
					flg = _required(v);
				} else {
					flg = _required(v, or.required);
				}
				if (!flg) {
					msg = msgs[n]['required'] || messages[n]['required'];
					func(Fx.$(n), msg);
					return false;
				}
			}
			if (or.minlength) {
				if (!_minlength(v, or.minlength)) {
					msg = msgs[n]['minlength'] || messages[n]['minlength'];
					func(Fx.$(n), Fx.String.format(msg, or.minlength));
					return false;
				}
			}
			if (or.maxlength) {
				if (!_maxlength(v, or.maxlength)) {
					msg = msgs[n]['maxlength'] || messages[n]['maxlength'];
					func(Fx.$(n), Fx.String.format(msg, or.maxlength));
					return false;
				}
			}
			if (or.rangelength) {
				if (!_rangelength(v, or.rangelength[0], or.rangelength[1])) {
					msg = msgs[n]['rangelength'] || messages[n]['rangelength'];
					func(Fx.$(n), Fx.String.format(msg, or.rangelength[0], or.rangelength[1]));
					return false;
				}
			}
			if (or.min) {
				if (!_min(v, or.min)) {
					msg = msgs[n]['min'] || messages[n]['min'];
					func(Fx.$(n), Fx.String.format(msg, or.min));
					return false;
				}
			}
			if (or.max) {
				if (!_max(v, or.max)) {
					msg = msgs[n]['max'] || messages[n]['max'];
					func(Fx.$(n), Fx.String.format(msg, or.max));
					return false;
				}
			}
			if (or.range) {
				if (!_range(v, or.range[0], or.range[1])) {
					msg = msgs[n]['range'] || messages[n]['range'];
					func(Fx.$(n), Fx.String.format(msg, or.range[0], or.range[1]));
					return false;
				}
			}
			if (or.email) {
				if (!_email(v)) {
					msg = msgs[n]['email'] || messages[n]['email'];
					func(Fx.$(n), msg);
					return false;
				}
			}
			if (or.url) {
				if (!_url(v)) {
					msg = msgs[n]['url'] || messages[n]['url'];
					func(Fx.$(n), msg);
					return false;
				}
			}
			if (or.regex) {
				if (!_regexp(v, or.regex)) {
					msg = msgs[n]['regex'] || messages[n]['regex'];
					func(Fx.$(n), msg);
					return false;
				}
			}
			if (or.equals) {
				if (!_equals(v, _json[or.equals])) {
					msg = msgs[n]['equals'] || messages[n]['equals'];
					func(Fx.$(n), Fx.String.format(msg, or.equals));
					return false;
				}
			}
		}
		return true;
	};

	function _required(field) {
		var args = arguments;

		if (!args[1]) {
			return field != '';
		}
		return args[1].test(field);
	};

	function _minlength(field, len) {
		if (field.length) {
			return field.length >= len;
		}
		return false;
	};

	function _maxlength(field, len) {
		if (field.length) {
			return field.length <= len;
		}
		return false;
	};

	function _rangelength(field, min, max) {
		var len = field.length;
		if (len) {
			return len >= min && len <= max;
		}
		return false;
	};

	function _min(v, n) {
		return +v >= n;
	};

	function _max(v, n) {
		return +v <= n;
	};

	function _range(v, n, m) {
		return +v >= n && +v <= m;
	};

	function _email(e) {
		if (e && e != '') {
			return emai_pattern.test(e);
		}
		return true;
	};

	function _url(u) {
		if (u && u != '') {
			return url_pattern.test(u);
		}
		return true;
	};

	function _equals(v1, v2) {
		return v1 == v2;
	};

	function _regexp(field, patt) {
		if (field && field != '') {
			return patt.test(field);
		}
		return true;
	};

	return validate;
})();

// 扩展到Fx对象原型 使用方式 $('#form').validate({rules :{}[,messages : {}]}[,function(e,msg){}])
Fx.protoExtend({validate : validate});