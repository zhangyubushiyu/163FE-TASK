//banner轮播
var bannerImg = document.getElementById('banner-list'),
	bannerImgLi = bannerImg.getElementsByTagName('li'),
	bannerBarLi = document.getElementById('banner-bar').getElementsByTagName('i'),
	banner = document.getElementById('banner');

var now = 0;
//遍历bannerBarLi
for(var i = 0; i < bannerBarLi.length; i++) {
	//定义一个下标
	bannerBarLi[i].index = i;
	//个BarLI添加鼠标移入事件
	bannerBarLi[i].onmouseover = function() {
		now = this.index;
		//调用bannerImgLi
		bannerTab();

	}

}

function bannerTab() {
	//控制bannerBarLi的className
	for(var i = 0; i < bannerBarLi.length; i++) {
		bannerBarLi[i].className = '';
	}
	bannerBarLi[now].className = 'active-bar';

	//控制bannerImgLi的className
	for(var j = 0; j < bannerImgLi.length; j++) {
		bannerImgLi[j].className = '';
		//把其他li的opacity设置0
		bannerImgLi[j].style.opacity = '0';
	}
	bannerImgLi[now].className = 'active-img';
	//淡入调用
	fadeout(bannerImgLi[now], 1);
}

//自动播发函数
function next() {
	now++;
	//判断bannerBarLi目前的位置
	if(now == bannerBarLi.length) {
		now = 0;
	}
	bannerTab();
}

//计时器
var teimr = setInterval(next, 5000);
//鼠标移入清除计时器
banner.onmouseover = function() {
		clearInterval(teimr);
	}
	//鼠标离开从启计时器
banner.onmouseout = function() {
	teimr = setInterval(next, 5000);
}

//向左循环滚动图片

var scrollImg = document.getElementById('clearfix');
var speed = -2;
scrollImg.innerHTML += scrollImg.innerHTML;

function scroll() {
	//复位					
	if(scrollImg.offsetLeft < -scrollImg.offsetWidth / 2) {
		scrollImg.style.left = '0';
	}
	//设置滚动
	scrollImg.style.left = scrollImg.offsetLeft + speed + 'px';
}
//计时器
var timeScroll = setInterval(scroll, 30)

//鼠标事件
scrollImg.onmouseover = function() {
	clearInterval(timeScroll);
}
scrollImg.onmouseout = function() {
	timeScroll = setInterval(scroll, 30)

}

//登录
var loginWin = document.getElementById("login"),
	//获取video窗口
	videoWin = document.getElementById("video"),
	//获取login关闭按钮
	loginOff = document.getElementById("login-off"),
	//获取关注按钮
	popLogin = document.getElementById("gz"),
	ygz = document.getElementById("ygz"),
	fs = document.getElementById("fs"),
	//获取弹出窗口遮蔽层
	popBox = document.getElementById("pop-box"),
	//获取video播放
	videoPlayBut = document.getElementById("videoPlay"),
	//获取登录用户名
	userName = document.getElementById("userName"),
	//获取登录密码
	Password = document.getElementById("password"),
	//获取登录提交按钮
	loginBut = document.getElementById("submit");

//登录开始
//登录表单验证函数
function loginVerify() {
	loginBut.onclick = function() {
		var patten = /^[a-zA-Z]\w{3,15}$/ig;
		if(patten.test(userName.value)) {
			var form = document.getElementById("form");
			//验证通过
			//			alert("验证通过1");
			ajax({
				method: "get", //传输方式
				url: "http://study.163.com/webDev/login.htm", //url地址
				data: /*form.serialize(),*/ { //传的参数
					"userName": "studyOnline",
					"password": "study.163.com"
				},
				success: function(text) {
					//成功后进这里
					alert(text);
					setCookie("loginSuc", "login", setCookieDate(10));
					popLogin.style.display = "none";
					ygz.style.display = "block";
					fs.style.display = "block";

				},
				async: true //同步方式，true异步, false不是异步
			});
		} else {
			//验正不通过
			alert("用户名或密码不合法！");
		}

	};
}

getLoginSuc();
//登录判断loginSuc是否存在
function getLoginSuc() {
	//点击关注按钮
	popLogin.onclick = function() {
		if(getCookie("loginSuc")) {
			//cookie存在调用关注按钮
		} else {
			//弹出登录窗口函数调用
			popOpen(popLogin, loginWin);
			//调用登录窗口关闭按钮
			loginOff.onclick = function() {
				//关闭窗口函数调用
				popOff(loginOff, loginWin);
			};

			loginVerify();
		}
	};
}

//视频播放
var videoOff = document.getElementById("video-off"),
	//获取弹出video按钮
	popVideo = document.getElementById("video-Play");

//视频播放函数
function videoPlay() {
	popVideo.onclick = function() {
		//弹出窗口
		popOpen(popVideo, videoWin);
		//自动播放视频
		videoPlayBut.play();
	};
	videoOff.onclick = function() {
		//关闭窗口
		popOff(videoOff, videoWin);
		//停止视频
		videoPlayBut.pause();
	};
}
videoPlay();

//课程数据获取

//pageNo页码 type课程分类 psize总条数
function contenrAjax(pageNo, type, psize) {
	ajax: ajax({
		method: "get", //传输方式
		url: "http://study.163.com/webDev/couresByCategory.htm", //url地址
		data: { //传的参数
			"pageNo": pageNo, //页数
			"psize": 20, //条数
			"type": type //课程类型	10设计 20编程
		},
		success: function(text) {
			contenrObj = JSON.parse(text);
			JsonObj = contenrObj.list;
			//储存课程下标
			var jsonArr = [],
				contenrHtml = '';
			for(var i = 0; i < JsonObj.length; i++) {
				jsonArr = [i];
				//遍历下标
				for(var j = 0; j < jsonArr.length; j++) {

					//免费价格处理
					JsonObj[i].price == 0 ? JsonObj[i].price = '免费' : JsonObj[i].price.toFixed(2);

					contenrHtml += '<li class="kc-list">\
								<a href="' + JsonObj[i].providerLink + '">\
									<div class="kc">\
										<div class="l-img"><img class="middlePhotoUrl" src="' + JsonObj[i].middlePhotoUrl + '" alt="' + JsonObj[i].name + '" /></div>\
										<div class="l-txt">\
											<h3 class="">' + JsonObj[i].name + '</h3>\
											<h4 class="">' + JsonObj[i].categoryName + '</h4>\
											<span class="span-1"><i class="learnerCount">' + JsonObj[i].learnerCount + '</i></span>\
											<span class="span-2">￥<i class="Listprice">' + JsonObj[i].price + '</i></span>\
										</div>\
									</div>\
									<div class="kc-hover" id="kc-hover">\
										<div class="kc-hover-top">\
											<img class="middlePhotoUrl" src="' + JsonObj[i].middlePhotoUrl + '" alt="' + JsonObj[i].name + '" />\
											<dl>\
												<h3 class="ListName">' + JsonObj[i].name + '</h3>\
												<dt><p><span class="learnerCount">' + JsonObj[i].learnerCount + '</span>在学</p></dt>\
												<dd>\
													<p>发布者：<span class="provider">' + JsonObj[i].provider + '</span></p>\
												</dd>\
												<dd>\
													<p>分类：<span class="">' + JsonObj[i].categoryName + '</span></p>\
												</dd>\
											</dl>\
										</div>\
										<div class="kc-hover-txt">\
											<p class="description">\
												' + JsonObj[i].description + '\
											</p>\
										</div>\
									</div>\
								</a>\
							</li>';
					contenrList.innerHTML = contenrHtml;
				}

			}

		},

		async: true //同步方式，true异步, false不是异步
	});

}

//默认加载课程列表，1为页码 10课程分类
contenrAjax(1, 10);

//翻页
var contenrList = document.getElementById('contenr-l-list'),
	pageDiv = document.getElementById('page'),
	pageLi = pageDiv.getElementsByTagName('li'),
	pageUp = document.getElementById('page-up'),
	pageDown = document.getElementById('page-down');
//翻页函数
function coursePage(page, type) {
	var now = 0;
	for(var i = 0; i < pageLi.length; i++) {
		pageLi[i].index = i;

		//默认进来是第一页码
		pageLi[now].className = 'active-page';

		//切换课程分类页码重置
		var page = pageLi[i].className = '';

		pageLi[i].onclick = function() {
			var type = 10;
			now = this.index;
			for(var i = 0; i < pageLi.length; i++) {
				pageLi[i].className = '';
			}

			//选中class
			pageLi[now].className = 'active-page';

			//判断当前停留在哪个分类
			design.className == 'active-checked' ? type = 10 : type = 20;
			contenrAjax(now + 1, type);
			return pageNow = now;
		}
		var pageNow = '';

		//下一页
		pageDown.onclick = function() {
			pageNow++;

			for(var i = 0; i < pageLi.length; i++) {
				pageLi[i].className = '';
			}
			if(pageNow >= 7) {
				pageLi[7].className = 'active-page';
			} else {
				pageLi[pageNow].className = 'active-page';
			}

			//判断当前停留在哪个分类
			design.className == 'active-checked' ? type = 10 : type = 20;
			contenrAjax(pageNow + 1, type);
			return pageNow;
		}

		//上一页
		pageUp.onclick = function() {
			pageNow--;

			for(var i = 0; i < pageLi.length; i++) {
				pageLi[i].className = '';
			}
			if(pageNow <= 0) {
				pageLi[0].className = 'active-page';
				pageNow = 0;
			} else {
				pageLi[pageNow].className = 'active-page';
			}

			//判断当前停留在哪个分类
			design.className == 'active-checked' ? type = 10 : type = 20;
			contenrAjax(pageNow + 1, type);
			return pageNow;
		}

	}

}
coursePage();

//切换课程
var design = document.getElementById('tab-1'),
	programme = document.getElementById('tab-2');

function contenrTab() {

	design.onclick = function() {
		//切换课程类型
		contenrAjax(1, 10);

		//调整页码相关
		// 1为初始化页码位置 10设计分类
		coursePage(1, 10);
		design.className = 'active-checked';
		programme.className = '';

	}
	programme.onclick = function() {
		//切换课程类型
		contenrAjax(1, 20);
		//调整页码相关
		// 1为初始化页码位置 20编程分类
		coursePage(1, 20);
		design.className = '';
		programme.className = 'active-checked';

	}
}
contenrTab();

//热销课程列表
function contenrHot() {
	ajax: ajax({
		method: "get", //传输方式
		url: "http://study.163.com/webDev/hotcouresByCategory.htm", //url地址
		success: function(text) {
			//成功后进这里
			var hotList = JSON.parse(text)
			var hotHmtl = '',
				hotListHtml = document.getElementById('hotList');
			for(var i = 0; i < 10; i++) {
				hotHmtl += '<li>\
								<a href="' + hotList[i].providerLink + '">\
									<img src="' + hotList[i].smallPhotoUrl + '" alt="' + hotList[i].name + '">\
									<h3>' + hotList[i].name + '</h3>\
									<span>' + hotList[i].learnerCount + '</span>\
								</a>\
							</li>';
				hotListHtml.innerHTML = hotHmtl;

			}

		},
		async: true //同步方式，true异步, false不是异步
	});

}

contenrHot();