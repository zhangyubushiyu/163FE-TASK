//批量获取class
function getByClass(oParent, sClass) {
	var aEle = oParent.getElementsByClassName('*'),
		aResult = [];
	for(var i = 0; i < aResult.length; i++) {
		if(aEle[i].className = sClass) {
			aResult.push(aEle[i]);
		}
	}
	return aResult;
}

//设置CSS
function getStyle(obj, name) {
	if(obj.currentStyle) {
		return obj.currentStyle[name];
	} else {
		return getComputedStyle(obj, false)[name];
	}
}

//设置动画
//srtraMove(id , {width:400, height:400} , fu)
function srtarMove(obj, json, fu) {
	clearInterval(obj.tiemr);
	obj.tiemr = setInterval(function() {
		var bStop = true;

		for(var arr in json) {

			var cur = 0;

			if(arr == 'opacity') {
				cur = Math.round(parseFloat(getStyle(obj, arr)) * 100);
			} else {
				cur = parseInt(getStyle(obj, arr));
			}

			var speed = (json[arr] - cur) / 6;
			speed = speed > 0 ? Math.ceil(speed) : Math.floor(speed);

			if(cur != json[arr]) bStop = false;

			if(arr == 'opacity') {
				obj.style.fiter = 'alpha(opacity:+' + (cur + speed) + ')';
				obj.style.opacity = (cur + speed) / 100;
			} else {
				obj.style[arr] = cur + speed + 'px';
			}

		}
		if(bStop) {
			clearInterval(obj.tiemr)
			if(fu) fu();
		}
	}, 30);

}

//淡入
function fadeout(elem, alpha) {
	var val = 0,
		timer = null;
	clearInterval(timer);
	timer = setInterval(function() {
		setOpacity(elem, val);
		if(alpha == 0) {
			val -= 0.1;
		}
		if(alpha == 1) {
			val += 0.1;
		}
		if(val > 1 || val < 0) {
			clearInterval(timer);
		}
	}, 50); //100毫秒*10次=1秒        

	//设置opacity 
	function setOpacity(element, value) {
		element.filters ? element.style.filter = 'alpha(opacity=' + value * 100 + ')' : element.style.opacity = value;
	}
}

//窗口关闭函数
function popOff(but, win) {
	popBox.style.display = "none";
	win.style.display = "none";
}
//窗口弹出函数
function popOpen(but, win) {
	popBox.style.display = "block";
	win.style.display = "block";
}

//cookie相关封装
//设置cookie
function setCookie(name, value, expires, path, domain, secure) {
	var cookieName = encodeURIComponent(name) + "=" + encodeURIComponent(value);
	if(expires instanceof Date) {
		cookieName += ";expires=" + expires;
	}
	if(path) {
		cookieName += ";path=" + path;
	}
	if(domain) {
		cookieName += ";domain=" + domain;
	}
	if(secure) {
		cookieName += ";secure";
	}

	document.cookie = cookieName;
}
//过期时间
function setCookieDate(day) { //传递一个天数
	var date = null;
	if(typeof day == "number" && day > 0) {
		date = new Date();
		date.setDate((date.getDate() + day));
	} else {
		throw new Error("传递的时间不合法！必须是数字且大于0");
	}
	return date;
}

//读取cookie
function getCookie(name) {
	var cookieName = encodeURIComponent(name) + "=";
	var cookieStart = document.cookie.indexOf(cookieName);
	var cookieValue = null;
	if(cookieStart > -1) {
		var cookieEnd = document.cookie.indexOf(";", cookieStart);
		if(cookieEnd == -1) {
			cookieEnd = document.cookie.length;
		}
		cookieValue = decodeURIComponent(document.cookie.substring(cookieStart + cookieName.length, cookieEnd));
	}
	return cookieValue;
}
//删除cookie
function deleteCookie(name) {
	var date = new Date();
	date.setTime(date.getTime() - 10000);
	document.cookie = name + "=v; expires=" + date.toGMTString();
}

//创建方法
//setCookie("user","章鱼哥",setCookieDate(7));
//读取方法
//getCookie("user");

//ajax封装
//浏览器添加事件
function addEvent(obj, type, fn) {
	if(obj.addEventListener) {
		obj.addEventListener(type, fn, false)
	} else if(obj.attachEvent) {
		obj.attachEvent("on" + type, fn);
	}
}

//跨浏览器移除事件
function removeEvent(obj, type, fn) {
	if(obj.removeEventListener) {
		obj.removeEventListener(type, fn, false);
	} else if(obj.detachEvent) {
		obj.detachEvent("on" + type, fn);
	}
}

//XHR支持检测
function createXHR() {
	if(typeof XMLHttpRequest != "undefined") {
		return new XMLHttpRequest();
	} else if(typeof ActiveXObject != "undefined") {
		var version = [
			"MSXML2.XMLHttp.6.0",
			"MSXML2.XMLHttp.3.0",
			"MSXML2.XMLHttp"
		];
		for(var i = 0; version.length; i++) {
			try {
				return new ActiveXObject(version[i]);
			} catch(e) {
				//跳过
			}
		}
	} else {
		throw new Error("您的系统或浏览器不支持XHR对象！");
	}
}
//名值对转换为字符串
function params(data) {
	var arr = [];
	for(var i in data) {
		arr.push(encodeURIComponent(i) + "=" + encodeURIComponent(data[i]));
	}
	return arr.join("&");
}

//封装ajax
function ajax(obj) {
	var xhr = createXHR();
	//url拼接
	obj.url = obj.url + "?rand=" + Math.random();
	obj.data = params(obj.data);

	if(obj.method === "get") obj.url += obj.url.indexOf("?") == -1 ? "?" + obj.data : "&" + obj.data;

	if(obj.async === true) {
		xhr.onreadystatechange = function() {
			if(xhr.readyState == 4) {
				callback();
			}
		};
	}
	xhr.open(obj.method, obj.url, obj.async);

	if(obj.method === "post") {
		xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
		xhr.send(obj.data);
	} else {
		xhr.send(null);
	}
	if(obj.async === false) {
		callback();
	}

	function callback() {
		if(xhr.status == 200) {
			obj.success(xhr.responseText); //回调传递参数
		} else {
			console.log("获取数据错误！错误代码：" + xhr.status + "，状态信息：" + xhr.statusText);
		}
	}
}

//iE8 getElementsByClassName兼容方法
function getElementsByClassName(ele, name) {
	//   先检测是否支持原生的getElementsByClassName
	if(ele.getElementsByClassName) {
		return ele.getElementsByClassName(name);
	} else {
		//     如果不支持就通过getElementsByTagName匹配所有标签，默认在目标元素下查找
		var children = (ele || document).getElementsByTagName("*");
		//     定义一个空数组，用于后续储存符合条件的元素
		var elements = [];
		//     第一次通过byTagName循环遍历目标元素下的所有元素
		for(var i = 0; i < children.length; i++) {
			var child = children[i];
			//       通过空格分隔元素的class名称
			var classNames = child.className.split(" ");
			//       再次循环遍历元素的className
			for(var j = 0; j < classNames.length; j++) {
				//         类名和传入的class相同时，通过push推到之前新建的空数组里
				if(classNames[j] === name) {
					elements.push(child);
					//           找到后就跳出循环
					break;
				}
			}
		}
		//     最后返回数组
		return elements;
	}
}