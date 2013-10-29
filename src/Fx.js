/**
 * Fx JS . Sylthas' JS Lib 简单是美
 * @authors Sylthas (sylthasgg@gmail.com)
 * @date    2013-10-27 16:11:15
 * @version 1.0 BEAT
 */
(function(window, undefined) {
	/* ################# 选择器 ################ */
	// 只支持 id, class, tag, tag[attribute=value] 四种选择 舍弃子对象选择
	var mini = (function() {
		var regClass = /^(?:[\w\-]+)?\.([\w\-]+)/,
			regId = /^(?:[\w\-]+)?#([\w\-]+)/,
			regNode = /^([\w\*\-]+)/,
			regNodeAttr = /^(?:[\w\-]+)?\[([\w]+)(=(\w+))?\]/,
			na = [null, null];

		function _find(selector, context) {
			context = context || document;
			var simple = /^[\w\-#]+$/.test(selector);
			if (!simple && context.querySelectorAll) {
				return realArray(context.querySelectorAll(selector));
			}
			var id = (selector.match(regId) || na)[1],
				className = !id && (selector.match(regClass) || na)[1],
				nodeName = !id && (selector.match(regNode) || na)[1],
				_attr = selector.match(regNodeAttr) || na,
				attrName = _attr[1] || null,
				attrValue = _attr[3] || null,
				collection = !id && realArray(context.getElementsByTagName(nodeName || '*'));
			if (className) {
				collection = filterByAttr(collection, 'className', className);
			}
			if (attrName) {
				collection = filterByAttr(collection, attrName, attrValue);
			}
			if (id) {
				var byId = context.getElementById(id);
				return byId ? [byId] : [];
			}
			return collection;
		};

		// 将集合转换为真正的数组

		function realArray(c) {
			try {
				return Array.prototype.slice.call(c);
			} catch (e) {
				var ret = [];
				for (var i = 0, len = c.length; i < len; ++i) {
					ret[i] = c[i];
				}
				return ret;
			}
		};

		// 集合属性过滤器

		function filterByAttr(collection, attr, regex) {
			var i = -1,
				node, r = -1,
				ret = [];
			while ((node = collection[++i])) {
				if (regex.test(node[attr])) {
					ret[++r] = node;
				}
			}
			return ret;
		};

		return _find;
	})();

	// 选择器过滤
	var $ = function(selector, context) {
		if (selector == null) return [];
		if (selector instanceof Array) {
			return selector;
		} else {
			if (typeof selector == 'object') {
				if (selector.nodeType) {
					return [selector];
				} else if (selector.size) {
					return selector;
				} else {
					return [selector];
				}
			} else {
				if (typeof selector != 'string') {
					return [];
				} else {
					if (context && context.size && context.length) context = context[0];
					return mini(selector, context);
				}
			}
		}
	};

	// Fx对象原型扩展
	var fx_prototype = {
		size: function() {
			return this.length;
		},
		get: function(num) {
			return num == undefined ? this : Fx(this[num]);
		},
		each: function(callback) {
			for (var i = 0, il = this.length; i < il; i++) {
				if (callback(Fx(this[i]), i) == 'break') break;
			}
			return this;
		},
		attr: function(name, value) {
			if (typeof(value) == 'undefined') {
				var el = this[0];
				switch (name) {
					case 'class':
						return el.className;
					case 'style':
						return el.style.cssText;
					default:
						return el.getAttribute(name);
				}
			} else {
				this.each(function(el) {
					el = el[0];
					switch (name) {
						case 'class':
							el.className = value;
							break;
						case 'style':
							el.style.cssText = value;
							break;
						default:
							el.setAttribute(name, value);
					}
				});
				return this;
			}
		},
		prop: function(name, value) {
			if (typeof(value) == 'undefined') {
				return this[0][name];
			} else {
				this.each(function(el) {
					el[0][name] = value;
				});
				return this;
			}
		},
		css: function(name, value) {
			if (typeof(value) == 'undefined') {
				var el = this[0];
				if (name == 'opacity') {
					if (el.filter) {
						return el.filter && el.filter.indexOf("opacity=") >= 0 ? parseFloat(el.filter.match(/opacity=([^)]*)/)[1]) / 100 : 1;
					} else {
						return el.style.opacity ? parseFloat(el.style.opacity) : 1;
					}
				} else {
					function hyphenate(name) {
						return name.replace(/[A-Z]/g,
							function(match) {
								return '-' + match.toLowerCase();
							});
					}
					if (window.getComputedStyle) {
						return window.getComputedStyle(el, null).getPropertyValue(hyphenate(name));
					}
					if (document.defaultView && document.defaultView.getComputedStyle) {
						var computedStyle = document.defaultView.getComputedStyle(el, null);
						if (computedStyle) return computedStyle.getPropertyValue(hyphenate(name));
						if (name == "display") return "none";
					}
					if (el.currentStyle) {
						return el.currentStyle[name];
					}
					return el.style[name];
				}
			} else {
				this.each(function(el) {
					el = el[0];
					if (name == 'opacity') {
						if (el.style.filter) {
							el.style.filter = 'Alpha(Opacity=' + value * 100 + ');';
							el.style.zoom = 1;
						} else {
							el.style.opacity = (value == 1 ? '' : '' + value);
						}
					} else {
						if (typeof value == 'number') value += 'px';
						el.style[name] = value;
					}
				});
				return this;
			}
		},
		text: function(value) {
			return this.prop(typeof(this[0].innerText) != 'undefined' ? 'innerText' : 'textContent', value);
		},
		html: function(value) {
			return this.prop('innerHTML', value);
		},
		val: function(value) {
			if (typeof(value) == 'undefined') {
				var el = this[0];
				if (el.tagName.toLowerCase() == 'input') {
					switch (el.type) {
						case 'checkbox':
							return el.checked ? true : false;
							break;
						case 'radio':
							return el.checked ? true : false;
							break;
					}
				}
				return el.value;
			} else {
				return this.prop('value', value);
			}
		},
		height: function(value) {
			if (typeof(value) == 'undefined') {
				var el = this[0];
				return el.offsetHeight || (el.style.height ? parseInt(el.style.height.replace('px', '')) : 0);
			} else {
				return this.css('height', value + 'px');
			}
		},
		width: function(value) {
			if (typeof(value) == 'undefined') {
				var el = this[0];
				return el.offsetWidth || (el.style.width ? parseInt(el.style.width.replace('px', '')) : 0);
			} else {
				return this.css('width', value + 'px');
			}
		},
		on: function(type, func) {
			this.each(function(el) {
				Fx.Event.addHandler(el[0], type, func);
			});
			return this;
		},
		show: function(val) {
			this.css('display', typeof val === 'undefined' ? 'block' : val);
			return this;
		},
		hide: function() {
			this.css('display', 'none');
			return this;
		},
		toggle: function() {
			var t = this[0].style.display == 'none' ? 'show' : 'hide';
			this[t]();
			return this;
		},
		focus: function() {
			this[0].focus();
			return this;
		},
		prev: function(n) {
			n = n || 0;
			var el = this[0],
				r, i = 0;
			while ((el = el.previousSibling)) {
				if (el.nodeType && el.nodeType == 1) {
					r = el;
					if (i == n) break;
					i++;
				}
			}
			return r ? Fx(r) : null;
		},
		next: function(n) {
			n = n || 0;
			var el = this[0],
				r, i = 0;
			while ((el = el.nextSibling)) {
				if (el.nodeType && el.nodeType == 1) {
					r = el;
					if (i == n) break;
					i++;
				}
			}
			return r ? Fx(r) : null;
		},
		parent: function(n) {
			var el = this[0];
			n = n || 0;
			for (var i = 0; i < n + 1; i++) {
				el = el.parentNode;
			}
			return Fx(el);
		},
		inject: function(el) {
			el = Fx(el);
			if (el) el.append(this);
			return this;
		},
		append: function() {
			var args = arguments;
			this.each(function(it) {
				for (var i = 0, il = args.length; i < il; i++) {
					Fx.insert(it[0], args[i], 3);
				}
			});
			return this;
		},
		prepend: function() {
			var args = arguments;
			this.each(function(it) {
				for (var i = args.length - 1; i >= 0; i--) {
					Fx.insert(it[0], args[i], 2);
				}
			});
			return this;
		},
		before: function() {
			var args = arguments;
			this.each(function(it) {
				for (var i = 0, il = args.length; i < il; i++) {
					Fx.insert(it[0], args[i], 1);
				}
			});
			return this;
		},
		after: function() {
			var args = arguments;
			this.each(function(it) {
				for (var i = args.length - 1; i >= 0; i--) {
					Fx.insert(it[0], args[i], 4);
				}
			});
			return this;
		},
		remove: function() {
			this.each(function(el) {
				el[0].parentNode.removeChild(el[0]);
			});
			return this;
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
		},
		serialize: function() {
			return Fx.Form.serialize(this[0]);
		}
	};

	/* ################# Fx Main ################ */
	var Fx = window.Fx = function(selector, context) {
		var ret = $(selector, context);
		if (ret.length) {
			Fx.Object.extend(ret, fx_prototype);
			return ret;
		}
		return null;
	};

	/* ################# Fx Object ################ */
	Fx.Object = {
		// 扩展对象
		extend: function(target, src) {
			for (var p in src)
				target[p] = src[p]
			return target;
		},
		// 遍历对象
		each: function(obj, func) {
			var i = 0;
			for (var k in obj) {
				if (func(k, obj[k], i++) == 'break') break;
			}
			return obj;
		},
		// 复制对象
		copy: function(target, src) {
			traget = traget || {};
			for (var p in src) {
				if (typeof src[p] === "object") {
					traget[p] = src[p].constructor === Array ? [] : {};
					arguments.callee(traget[p], src[p]);
				} else {
					traget[p] = src[p];
				}
			}
			return traget;
		}
	};

	/* ################# Fx Event ################ */
	Fx.Event = {
		getEvent: function(event) {
			return event || window.event;
		},
		addHandler: function(e, type, handler) {
			if (e.addEventListener) {
				e.addEventListener(type, handler, false);
			} else if (e.attachEvent) {
				e.attachEvent("on" + type, handler);
			} else {
				e["on" + type] = handler;
			}
		},
		removeHandler: function(e, type, handler) {
			if (e.removerEventListener) {
				e.removerEventListener(type, handler, false);
			} else if (e.detachEvent) {
				e.detachEvent("on" + type, handler);
			} else {
				e["on" + type] = null;
			}
		},
		getTarget: function(event) {
			return event.target || event.srcElement;
		},
		preventDefault: function(event) {
			if (event.preventDefault) {
				event.preventDefault();
			} else {
				event.returnValue = false;
			}
		},
		stopPropagation: function(event) {
			if (event.stopPropagation) {
				event.stopPropagation();
			} else {
				event.cancelBubble = true;
			}
		},
		getRelatedTaget: function(event) {
			if (event.relatedTarget) {
				return event.relatedTarget;
			} else if (event.toElement) {
				return event.toElement;
			} else if (event.fromElement) {
				return event.fromElement;
			} else {
				return null;
			}
		}
	};

	/* ################# Fx String ################ */
	Fx.String = {
		//remove space of head and end
		trim: function(str) {
			return str.replace(/^\s+|\s+$/g, '');
		},
		//escapeHTML
		escapeHTML: function(str) {
			return str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
		},
		//unescapeHTML
		unescapeHTML: function(str) {
			return str.replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&amp;/g, '&');
		},
		//get the string's length, a Chinese char is two lengths
		byteLength: function(str) {
			return str.replace(/[^\x00-\xff]/g, "**").length;
		},
		//remove the last char
		delLast: function(str) {
			return str.substring(0, str.length - 1);
		},
		//String to Int
		toInt: function(str) {
			return Math.floor(str);
		},
		//String to Array
		toArray: function(str, o) {
			return str.split(o || '');
		},
		//substring, start from head, and a Chinese char is two lengths
		left: function(str, n) {
			var s = str.replace(/\*/g, " ").replace(/[^\x00-\xff]/g, "**");
			s = s.slice(0, n).replace(/\*\*/g, " ").replace(/\*/g, "").length;
			return str.slice(0, s);
		},
		//substring, start from end, and a Chinese char is two lengths
		right: function(str, n) {
			var len = str.length;
			var s = str.replace(/\*/g, " ").replace(/[^\x00-\xff]/g, "**");
			s = s.slice(s.length - n, s.length).replace(/\*\*/g, " ").replace(/\*/g, "").length;
			return str.slice(len - s, len);
		},
		//remove HTML tags 
		removeHTML: function(str) {
			return str.replace(/<\/?[^>]+>/gi, '');
		},
		//format string
		//eg. "<div>{0}</div>{1}".format(txt0,txt1);
		format: function() {
			var str = arguments[0],
				args = [];
			for (var i = 1, il = arguments.length; i < il; i++) {
				args.push(arguments[i]);
			}
			return str.replace(/\{(\d+)\}/g, function(m, i) {
				return args[i];
			});
		},
		// toString(16)
		toHex: function(str) {
			var a = [],
				i = 0;
			for (; i < str.length;) a[i] = ("00" + str.charCodeAt(i++).toString(16)).slice(-4);
			return "\\u" + a.join("\\u");
		},
		// unString(16)
		unHex: function(str) {
			return unescape(str.replace(/\\/g, "%"));
		}
	};

	/* ################# Fx Date ################ */
	Fx.Date = {
		format: function(date, f) {
			var o = {
				"M+": date.getMonth() + 1,
				"d+": date.getDate(),
				"h+": date.getHours(),
				"m+": date.getMinutes(),
				"s+": date.getSeconds(),
				"q+": Math.floor((date.getMonth() + 3) / 3),
				"S": date.getMilliseconds()
			};
			if (/(y+)/.test(f))
				f = f.replace(RegExp.$1, (date.getFullYear() + "").substr(4 - RegExp.$1.length));
			for (var k in o)
				if (new RegExp("(" + k + ")").test(f))
					f = f.replace(RegExp.$1, RegExp.$1.length == 1 ? o[k] : ("00" + o[k]).substr(("" + o[k]).length));
			return f;
		}
	};

	/* ################# Fx Cookie ################ */
	Fx.Cookie = {
		get: function(name) {
			var v = document.cookie.match('(?:^|;)\\s*' + name + '=([^;]*)');
			return v ? decodeURIComponent(v[1]) : null;
		},
		set: function(name, value, expires, path, domain) {
			var str = name + "=" + encodeURIComponent(value);
			if (expires != null || expires != '') {
				if (expires == 0) {
					expires = 100 * 365 * 24 * 60;
				}
				var exp = new Date();
				exp.setTime(exp.getTime() + expires * 60 * 1000);
				str += "; expires=" + exp.toGMTString();
			}
			if (path) {
				str += "; path=" + path;
			}
			if (domain) {
				str += "; domain=" + domain;
			}
			document.cookie = str;
		},
		del: function(name, path, domain) {
			document.cookie = name + "=" +
				((path) ? "; path=" + path : "") +
				((domain) ? "; domain=" + domain : "") +
				"; expires=Thu, 01-Jan-70 00:00:01 GMT";
		}
	};

	/* ################# Fx Browser ################ */
	(function() {
		var agent = navigator.userAgent.toLowerCase();
		Fx.Browser = {
			version: (agent.match(/.+(?:rv|it|ra|ie)[\/: ]([\d.]+)/) || [0, '0'])[1],
			safari: /webkit/i.test(agent) && !this.chrome,
			opera: /opera/i.test(agent),
			firefox: /firefox/i.test(agent),
			ie: /msie/i.test(agent) && !/opera/.test(agent),
			chrome: /chrome/i.test(agent) && /webkit/i.test(agent) && /mozilla/i.test(agent)
		};
	})();

	/* ################# Fx Ajax ################ */
	Fx.Ajax = (function() {
		function _xmlHttpReq() {
			if (window.ActiveXObject) {
				try {
					return new ActiveXObject('Msxm12.XMLHTTP');
				} catch (e) {
					try {
						return new ActiveXObject('Microsoft.XMLHTTP');
					} catch (e) {}
				}
			} else if (window.XMLHttpRequest) {
				try {
					return new XMLHttpRequest();
				} catch (e) {}
			}
		};

		function get(url, func, type) {
			return request(url, {
				async: true,
				method: 'GET',
				type: type,
				success: func
			});
		};

		function post(url, data, func, type, encode) {
			return request(url, {
				async: true,
				method: 'POST',
				type: type,
				encode: encode,
				success: func
			});
		};

		function request(url, opt) {
			var xhr = _xmlHttpReq();
			if (!xhr) return;

			function fn() {}
			opt = opt || {};
			var async = opt.async !== false,
				method = opt.method || "GET",
				type = opt.type || "text",
				encode = opt.encode || "UTF-8",
				timeout = opt.timeout || 0,
				data = opt.data || null,
				success = opt.success || fn,
				failure = opt.failure || fn;
			method = method.toUpperCase();
			if (data && typeof data == "object") {
				data = _serialize(data);
			}
			if (method == "GET" && data) {
				url += (url.indexOf("?") == -1 ? "?" : "&") + data;
				data = null;
			}
			var isTimeout = false,
				timer = undefined;
			if (async && timeout > 0) {
				timer = setTimeout(function() {
					xhr.abort();
					isTimeout = true;
				}, timeout);
			}
			var _this = this;
			xhr.onreadystatechange = function() {
				if (xhr.readyState == 4 && !isTimeout) {
					_onStateChange(xhr, type, success, failure);
					if (timer) clearTimeout(timer);
				} else {}
			};
			xhr.open(method, url, async);
			if (method == "POST") {
				xhr.setRequestHeader("Content-type", "application/x-www-form-urlencoded;charset=" + encode);
			}
			xhr.send(data);
			return xhr;
		};

		function _serialize(data) {
			var a = [];
			for (var k in data) {
				var val = data[k];
				if (val.constructor == Array) {
					for (var i = 0; i < val.length; i++) {
						a.push(k = "=" + encodeURIComponent(val[i]));
					}
				} else {
					a.push(k + "=" + encodeURIComponent(val));
				}
			}
			return a.join("&");
		};

		function _onStateChange(xhr, type, success, failure) {
			failure = failure || function() {};
			var s = xhr.status,
				result = null;
			if (s >= 200 && s < 300) {
				switch (type) {
					case "text":
						result = xhr.responseText;
						break;
					case "json":
						result = function(s) {
							try {
								return JSON.parse(s);
							} catch (e) {
								try {
									return eval('(' + s + ')');
								} catch (e) {}
							}
						}(xhr.responseText);
						break;
					case "xml":
						result = xhr.responseXML;
						break;
				}
				typeof result != null && success(result);
			} else if (s === 0) {
				failure(xhr, "Request timeout!");
			} else {
				failure(xhr, xhr.status);
			}
			xhr = null;
		};
		return {
			get: get,
			post: post,
			ajax: request
		};
	})();

	/* ################# Fx Form ################ */
	Fx.Form = {
		serialize: function(form) {
			var form = $(form)[0],
				data = [];
			if (!form || form.nodeName != 'FORM') return;
			var elems = form.elements,
				e = null;
			for (var i = 0, len = elems.length; i < len; i++) {
				e = elems[i];
				switch (e.type.toLowerCase()) {
					case 'select-one':
						var value = null,
							opt, index = e.selectedIndex;
						if (index >= 0) {
							opt = e.options[index];
							value = typeof opt.value == 'undefined' ? opt.text : opt.value;
						}
						data.push(encodeURIComponent(e.name) + '=' + encodeURIComponent(value));
						break;
					case 'select-multiple':
						for (var k = 0, kl = e.length; k < kl; k++) {
							var opt = e.options[k],
								value = null;
							if (opt.selected) {
								value = typeof opt.value == 'undefined' ? opt.text : opt.value;
								data.push(encodeURIComponent(e.name) + '=' + encodeURIComponent(value));
							}
						}
						break;
					case undefined:
					case 'file':
					case 'submit':
					case 'reset':
					case 'button':
						break;

					case 'radio':
					case 'checkbox':
						if (!e.checked)
							break;
					default:
						data.push(encodeURIComponent(e.name) + "=" + encodeURIComponent(e.value));

				}
			}
			return data.join('&');
		},
		json: function(form) {
			var form = $(form)[0],
				data = {};
			if (!form || form.nodeName != 'FORM') return;
			var elems = form.elements,
				e = null;
			for (var i = 0, len = elems.length; i < len; i++) {
				e = elems[i];
				switch (e.type.toLowerCase()) {
					case 'select-one':
						var value = null,
							opt, index = e.selectedIndex;
						if (index >= 0) {
							opt = e.options[index];
							value = typeof opt.value == 'undefined' ? opt.text : opt.value;
						}
						data[e.name] = value;
						break;
					case 'select-multiple':
						var value = [];
						for (var k = 0, kl = e.length; k < kl; k++) {
							var opt = e.options[k];
							if (opt.selected) {
								var optValue = typeof opt.value == 'undefined' ? opt.text : opt.value;
								value.push(optValue);
							}
						}
						data[e.name] = value
						break;
					case undefined:
					case 'file':
					case 'submit':
					case 'reset':
					case 'button':
						break;

					case 'radio':
					case 'checkbox':
						if (!e.checked)
							break;
					default:
						data[e.name] = e.value;

				}
			}
			return data;
		}
	};

	/* ################# Fx Util ################ */
	// Fx.Util = {};

	/* ################# Fx Extend ################ */
	Fx.extend = function(opts) {
		Fx.Object.extend(Fx, opts);
	};

	// 扩展 DOM 插入 和 控制台输出
	Fx.extend({
		insert: function(e, content, pos) {
			var _insert = function(e, value) {
				switch (pos) {
					case 1:
						e.parentNode.insertBefore(value, e);
						break;
					case 2:
						e.insertBefore(value, e.firstChild);
						break;
					case 3:
						if (e.tagName.toLowerCase() == 'table' && value.tagName.toLowerCase() == 'tr') {
							if (e.tBodies.length == 0) {
								e.appendChild(document.createElement('tbody'));
							}
							e.tBodies[0].appendChild(value);
						} else {
							e.appendChild(value);
						}
						break;
					case 4:
						e.parentNode.insertBefore(value, e.nextSibling);
						break;
					default:
				}
			};
			pos = pos || 1;
			if (typeof content == 'object') {
				_insert(e, content);
			} else {
				if (typeof content == 'string') {
					var div = document.createElement('div');
					div.innerHTML = content;
					var childs = div.childNodes;
					var nodes = [];
					for (var i = childs.length - 1; i >= 0; i--) {
						nodes.push(div.removeChild(childs[i]));
					}
					nodes = nodes.reverse();
					for (var i = 0, il = nodes.length; i < il; i++) {
						_insert(e, nodes[i]);
					}
				}
			}
			return this;
		},
		info: function(str) {
			if (typeof console != 'undefined' && console.log)
				console.info(str);
		},
		log: function(str) {
			if (typeof console != 'undefined' && console.log)
				console.log(str);
		},
		error: function(msg) {
			if (typeof console !== 'undefined' && console.error)
				console.error(msg);
		}
	});

	// 扩展 Ajax 绑定
	Fx.extend(Fx.Ajax);

	Fx.extend({
		bp: function() {
			// BasePath
			var urlPath = window.document.location.href;
			var pathName = window.document.location.pathname;
			var pos = pathName == '/' ? urlPath.length - 1 : urlPath.indexOf(pathName);
			var localhostPaht = urlPath.substring(0, pos);
			var projectName = pathName == '/' ? '' : pathName.substring(0, pathName.substr(1).indexOf("/") + 1);
			return localhostPaht + projectName;
		}
	});

	/* ################# Fx Name 选择器扩展 ################ */
	Fx.$ = function(name) {
		if (typeof name != 'string')
			return null;
		var c = document.getElementsByName(name);
		try {
			return Fx(Array.prototype.slice.call(c));
		} catch (e) {
			var ret = [];
			for (var i = 0, len = c.length; i < len; ++i) {
				ret[i] = c[i];
			}
			return Fx(ret);
		}
	};

	/* ################# Fx  对象Prototype扩展 ################ */
	Fx.protoExtend = function(opt) {
		Fx.Object.extend(fx_prototype, opt);
	} ;

	// 若$变量没有被使用则绑定Fx到$全局变量上
	window.$ = window.$ || Fx;
})(window);