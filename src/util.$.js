// 选择器

function $(id) {
	return new $.prototype.init(id);
};
$.prototype = {
	init: function(id) {
		this[0] = document.getElementById(id) || document.getElementsByName(id)[0] || null;
		return this;
	},
	val: function(val) {
		if (this[0] == null)
			return;
		if (val == null) {
			return this[0].value;
		} else {
			this[0].value = typeof val == "string" || typeof val == "number" ? val : this[0].value;
			return this;
		}
	},
	html: function(val) {
		if (this[0] == null)
			return;
		if (val == null) {
			return this[0].innerHTML;
		} else {
			this[0].innerHTML = typeof val == "string" || typeof val == "number" ? val : this[0].value;
			return this;
		}
	},
	show: function() {
		if (this[0] == null)
			return;
		this[0].style.display = "block";
		return this;
	},
	hidden: function() {
		if (this[0] == null)
			return;
		this[0].style.display = "none";
		return this;
	},
	toDisplay: function() {
		if (this[0] == null)
			return;
		var val = this[0].style.display;
		this[0].style.display = val == "none" ? "block" : "none";
		return this;
	},
	click: function(handler) {
		if (this[0] == null)
			return;
		if (this[0].addEventListener) {
			this[0].addEventListener("click", handler, false);
		} else if (this[0].attachEvent) {
			this[0].attachEvent("onclick", handler);
		} else {
			this[0]["onclick"] = handler;
		}
	},
	addHandler: function(type, handler) {
		if (this[0] == null)
			return;
		if (this[0].addEventListener) {
			this[0].addEventListener(type, handler, false);
		} else if (e.attachEvent) {
			this[0].attachEvent("on" + type, handler);
		} else {
			this[0]["on" + type] = handler;
		}
	},
	removeHandler: function(type, handler) {
		if (this[0] == null)
			return;
		if (this[0].removerEventListener) {
			this[0].removerEventListener(type, handler, false);
		} else if (this[0].detachEvent) {
			this[0].detachEvent("on" + type, handler);
		} else {
			this[0]["on" + type] = null;
		}
	},
	attr: function(name, value) {
		if (this[0] == null)
			return;
		this[0].setAttribute(name, value);
	},
	fadeIn: function(speed, opacity) {
		if (this[0] == null)
			return;
		var elem = this[0];
		var _this = this;
		speed = speed || 20;
		opacity = opacity || 100;
		// 显示元素,并将元素值为0透明度(不可见)
		elem.style.display = "block";
		this.setOpacity(0);
		// 初始化透明度变化值为0
		var val = 0;
		// 循环将透明值以5递增,即淡入效果
		(function() {
			_this.setOpacity(val);
			val += 5;
			if (val <= opacity) {
				setTimeout(arguments.callee, speed);
			}
		})();
	},
	fadeOut: function(speed, opacity) {
		if (this[0] == null)
			return;
		var _this = this;
		speed = speed || 20;
		opacity = opacity || 0;
		// 初始化透明度变化值为0
		var val = 100;
		// 循环将透明值以5递减,即淡出效果
		(function() {
			_this.setOpacity(val);
			val -= 5;
			if (val >= opacity) {
				setTimeout(arguments.callee, speed);
			} else if (val < 0) {
				// 元素透明度为0后隐藏元素
				_this[0].style.display = "none";
			}
		})();
	},
	setOpacity: function(v) {
		if (this[0] == null)
			return;
		this[0].filters ? this[0].style.filter = "alpha(opacity=" + v + ")" : this[0].style.opacity = v / 100;
	}
};
$.prototype.init.prototype = $.prototype;