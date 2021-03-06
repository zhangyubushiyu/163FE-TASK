//banner轮播
function banner() {
	//节点获取
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
		bannerBarLi[i].onclick = function() {
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
			bannerImgLi[j].style.display = 'none';

		}
		bannerImgLi[now].style.display = 'block';
		//淡入调用
		fadeout(bannerImgLi[now], 1);
	};

	//自动播发函数
	function next() {
		//		alert();
		now++;
		//判断bannerBarLi目前的位置
		if(now == bannerBarLi.length) {
			now = 0;
		}
		bannerTab();
	}

	//计时器
	var bannerTeimr = setInterval(next, 5000);
	//鼠标移入清除计时器
	banner.onmouseover = function() {
			clearInterval(bannerTeimr);
		}
		//鼠标离开从启计时器
	banner.onmouseout = function() {
		bannerTeimr = setInterval(next, 5000);
	}

}
banner();

//向左循环滚动图片
function scroll() {
	var scrollImg = document.getElementById('clearfix'),
		speed = -2,
		scrollImgHtml = scrollImg.innerHTML;
	scrollImg.innerHTML += scrollImg.innerHTML + scrollImgHtml;

	function scrollImgFun() {
		//复位					
		if(scrollImg.offsetLeft < -scrollImg.offsetWidth / 3) {
			scrollImg.style.left = '0';
		}
		//设置滚动
		scrollImg.style.left = scrollImg.offsetLeft + speed + 'px';
	}
	//计时器
	var timeScroll = setInterval(scrollImgFun, 30);

	//鼠标事件
	scrollImg.onmouseover = function() {
		clearInterval(timeScroll);
	}
	scrollImg.onmouseout = function() {
		timeScroll = setInterval(scrollImgFun, 30)
	}
}
scroll();

//视频播放函数
function videoPlay() {
	var videoOff = document.getElementById("video-off"),
		//获取弹出video按钮
		popVideo = document.getElementById("video-Play");

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
			"psize": psize, //条数
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
					JsonObj[i].price == 0 ? JsonObj[i].price = '免费' : JsonObj[i].price = JsonObj[i].price.toFixed(2);

					contenrHtml += '<li class="kc-list">\
								<a href="' + JsonObj[i].providerLink + '">\
									<div class="kc">\
										<div class="l-img"><img class="middlePhotoUrl" src="' + JsonObj[i].middlePhotoUrl + '" alt="' + JsonObj[i].name + '" /></div>\
										<div class="l-txt">\
											<h3>' + JsonObj[i].name + '</h3>\
											<h4>' + JsonObj[i].provider + '</h4>\
											<span class="span-1"><i class="learnerCount">' + JsonObj[i].learnerCount + '</i></span>\
											<span class="span-2">￥<i class="Listprice">' + JsonObj[i].price + '</i></span>\
										</div>\
									</div>\
									<div class="kc-hover" >\
										<div class="kc-hover-top">\
											<div class="kc-hover-img">\
											<img class="middlePhotoUrl" src="' + JsonObj[i].middlePhotoUrl + '" alt="' + JsonObj[i].name + '" />\
											</div>\
											<dl>\
												<h3 class="ListName">' + JsonObj[i].name + '</h3>\
												<dt><p><span class="learnerCount">' + JsonObj[i].learnerCount + '</span>在学</p></dt>\
												<dd>\
													<p>发布者：<span class="provider">' + JsonObj[i].provider + '</span></p>\
												</dd>\
												<dd>\
													<p>分类：<span class="">' + JsonObj[i].provider + '</span></p>\
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
					contenrPop();
				}

			}

			function contenrPop() {
				//课程鼠标悬停弹出课程详情
				var contenrLi = getElementsByClassName(contenrList, 'kc-list'),
					contenrHover = getElementsByClassName(contenrList, 'kc-hover'),
					txt = getElementsByClassName(contenrList, 'l-txt'),
					hoverindex = 0;

				for(var i = 0; i < contenrLi.length; i++) {
					contenrLi[i].index = i,
						leaveH3 = null;
					//鼠标移入
					contenrLi[i].onmouseenter = function() {
							hoverindex = this.index;
							var txtH3 = txt[hoverindex].getElementsByTagName('h3')[0];
							txtH3.style.color = '#39a030';
							leaveH3 = txtH3;

							for(var i = 0; i < contenrLi.length; i++) {
								contenrHover[i].style.display = 'none';

							}

							//课程弹出延时
							setTimeout(function() {
								contenrHover[hoverindex].style.display = 'block';
							}, 500);

							return txtH3;

						}
						//鼠标移开
					contenrLi[i].onmouseleave = function() {
						contenrHover[hoverindex].style.display = 'none';
						leaveH3.style.color = '';
					}

				}
			}

		},

		async: true //同步方式，true异步, false不是异步
	});

}

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
			var type = 10,
				psize = 20;
			now = this.index;
			for(var i = 0; i < pageLi.length; i++) {
				pageLi[i].className = '';
			}

			//选中class
			pageLi[now].className = 'active-page';

			//判断当前停留在哪个分类
			design.className == 'active-checked' ? type = 10 : type = 20;
			document.body.offsetWidth < 1205 ? psize = 15 : psize = 20;

			contenrAjax(now + 1, type, psize);
			return pageNow = now;
		}
		var pageNow = '';

		//下一页
		pageDown.onclick = function() {
			pageNow++;
			console.log(pageNow);
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

			document.body.offsetWidth < 1205 ? psize = 15 : psize = 20;

			contenrAjax(pageNow + 1, type, psize);
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
			document.body.offsetWidth < 1205 ? psize = 15 : psize = 20;

			contenrAjax(pageNow + 1, type, psize);
		}

	}
	var design = document.getElementById('tab-1'),
		programme = document.getElementById('tab-2');

	function contenrTab() {

		var psize = 20;
		design.onclick = function() {
			document.body.offsetWidth < 1205 ? psize = 15 : psize = 20;

			//切换课程类型
			contenrAjax(1, 10, psize);
			//调整页码相关
			// 1为初始化页码位置 10设计分类
			coursePage(1, 10);
			design.className = 'active-checked';
			programme.className = '';

		}
		programme.onclick = function() {
			document.body.offsetWidth < 1205 ? psize = 15 : psize = 20;
			//切换课程类型
			contenrAjax(1, 20, psize);
			//调整页码相关
			// 1为初始化页码位置 20编程分类
			coursePage(1, 20);
			design.className = '';
			programme.className = 'active-checked';

		}
	}
	contenrTab();
}
coursePage();

//热销课程列表
function contenrHot() {
	hotAjax: ajax({
		method: "get", //传输方式
		url: "http://study.163.com/webDev/hotcouresByCategory.htm", //url地址
		success: function(text) {
			//成功后进这里
			var hotList = JSON.parse(text)
			var hotHmtl = '',
				//节点
				hotListHtml = document.getElementById('hotList');

			function hotHmtlFun() {
				for(var i = 0; i < hotList.length; i++) {
					hotHmtl += '<li>\
								<a href="' + hotList[i].providerLink + '">\
									<img src="' + hotList[i].smallPhotoUrl + '" alt="' + hotList[i].name + '" />\
									<h3>' + hotList[i].name + '</h3>\
									<span class="hto-span">' + hotList[i].learnerCount + '</span>\
								</a>\
							</li>';
					//插入到hmtl
					hotListHtml.innerHTML = hotHmtl;
					//排序 
					setSort.li('hotList', 'hto-span', 'sort');

				}

			}
			hotHmtlFun();
			//热门排序
			hotListScrollFun();

		},
		async: true, //同步方式，true异步, false不是异步
	});

}

contenrHot();

function hotListScrollFun() {
	//热门课程循环
	//滚动
	var hotListScroll = document.getElementById('hotList');
	var hotSpeed = 0;
	hotListScroll.innerHTML += hotListScroll.innerHTML;

	function hotscroll() {
		//复位					
		if(hotListScroll.offsetTop < -hotListScroll.offsetHeight / 2) {
			hotSpeed = 0;
		}
		//设置滚动
			hotSpeed--;
			hotListScroll.style.top = hotSpeed + 'px';
	}
	//计时器 
	var timeHotScroll = setInterval(hotscroll, 60);
	//鼠标事件
		hotListScroll.onmouseover = function() {
			clearInterval(timeHotScroll);
		}
		hotListScroll.onmouseout = function() {
			timeHotScroll = setInterval(hotscroll, 60)
		}
}

//检测大小屏幕
function maxMinscreen() {
	var minCss = document.getElementById('minW');
	if(document.body.offsetWidth <= 1205) {
		//加载小屏css
		minCss.href = 'css/min-1025.css';
		//课程加载每页15条
		contenrAjax(1, 10, 15);

	} else {
		//默认加载课程列表，1为页码 10课程分类
		//课程加载每页20条
		contenrAjax(1, 10, 20);
	}

	var timerBody;
	timerBody = setInterval(function() {
		if(document.body.offsetWidth <= 1205) {
			minCss.href = 'css/min-1025.css';

		} else {
			minCss.href = '';
		}
	}, 500);

	//监听窗口大小
	window.onresize = function() {
		if(document.body.offsetWidth <= 1205) {
			minCss.href = 'css/min-1025.css';
			contenrAjax(1, 10, 15);

		} else {
			minCss.href = '';
			contenrAjax(1, 10, 20);

		}
	}
}
maxMinscreen();
function addd(){
	var a = 0,
		hotSpeed=0;
	setInterval(function() {
		
	
	for(var i = 70; i > 0, i--;) {
		hotSpeed = i;
		
		console.log(i);

	}
}, 70);
};
//addd();

