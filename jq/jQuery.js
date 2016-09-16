//banner轮播图
(function banner() {
	var now = 0,
		bannerBtnI = $('#banner-bar').children('i'),
		bannerImg = $('#banner-list').children('li'),
		timer;
	$.each(bannerBtnI, function(i) {
		bannerBtnI[i].index = i;
		bannerBtnI.mouseenter(function() {
			now = this.index;
			bannerTab();

		})

	});
	//轮播按钮切换
	function bannerTab() {
		$.each(bannerBtnI, function(i) {
			bannerBtnI.eq(i).removeClass();
			bannerImg.eq(i).css({
				'z-index': '0',
				'display': 'block'
			});

		});
		bannerBtnI.eq(now).addClass('active-bar');
		bannerImg.eq(now).css({
			'z-index': now + 1,
			'display': 'none'
		});
		//淡入500毫秒
		bannerImg.eq(now).fadeIn(500);

	}
	//自动播发
	function next() {
		now++;
		if(now == bannerBtnI.length) {
			now = 0;
		}
		bannerTab();
	}
	//计时器5s
	timer = setInterval(next, 5000);
	//鼠标移入移出
	$('#banner').mouseenter(function() {
		clearInterval(timer);
	})
	$('#banner').mouseleave(function() {
		timer = setInterval(next, 5000);
	})

})();

//课程列表翻页
function page() {
	var pageUp = $('#page-up'),
		pageDown = $('#page-down'),
		pageLi = $('#page').children('ul').children('li'),
		now = 0;
	//默认停留页码1
	pageLi.eq(0).addClass('active-page');

	//页码点击
	function pageClick() {
		$.each(pageLi, function(i) {
				pageLi[i].index = i;
				pageLi.eq(i).click(function(i) {
					now = this.index;
					$.each(pageLi, function(i) {
						pageLi.eq(i).removeClass();
					});

					pageLi.eq(now).addClass('active-page');
					//判断课程分类调用
					courseTabClick();
					//加载课程
					course(now, type);
				})

			})
			//上一页下一页点击调用
		pageUp.click(pageTab(pageUp));
		pageDown.click(pageTab(pageDown));

	}
	pageClick();
	//上一页下一页点击
	function pageTab(obj) {

		obj.click(function() {
			//判断课程分类调用
			courseTabClick();
			//判断页码
			if(obj == pageUp) {
				if(now == 0) {
					now = 0;
				} else {
					now--;
					pageLi.removeClass()
					pageLi.eq(now).addClass('active-page');
					course(now, type);

				}

			} else if(obj == pageDown) {
				if(now >= pageLi.length - 1) {
					now = 0;
				} else {
					now++;
					pageLi.removeClass()
					pageLi.eq(now).addClass('active-page');
					course(now, type);
				}
			}
		})

	};
	//课程切换
	function courseTab() {
		var design = $('#tab-1'),
			programme = $('#tab-2');

		design.click(function() {
			design.addClass('active-checked');
			//清除多余的class
			programme.removeClass();
			pageLi.removeClass();
			//页码停留在第一页码
			pageLi.eq(0).addClass('active-page');
			//调用课程
			course(0, 10);

		});
		programme.click(function() {
			programme.addClass('active-checked');
			//清除多余的class
			design.removeClass();
			pageLi.removeClass();
			//页码停留在第一页码
			pageLi.eq(0).addClass('active-page');
			//调用课程
			course(0, 20);

		});
	}
	//课程切换Tab判断函数
	function courseTabClick() {
		if($('#tab-1').hasClass('active-checked')) {
			type = 10;
		} else {
			type = 20;
		}
		//返回值
		return type;
	}
	courseTab();

};
page();

function course(pageNo, type) {
	var courseObj = null,
		courseArr = [],
		courseHtml = '';
	//页码判断
	if(pageNo) {
		pageNo++;
	} else if(pageNo < 0) {
		pageNo = 1;

	} else {
		pageNo = 1

	}
	//分类判断
	if(type) {
		type = type
	} else {
		type = 10;
	}
	//ajax调用
	$.ajax({
		type: 'get',
		url: 'http://study.163.com/webDev/couresByCategory.htm',
		data: {
			'pageNo': pageNo, //页数
			'psize': 20, //条数
			'type': type //课程类型	10设计 20编程
		},
		success: function(data) {
			//转行成对象
			courseObj = JSON.parse(data);
			//生成html调用
			courseList(courseObj.list);
		},
		error: function(jqXHR) {
			console.log('发生错误:' + jqXHR.status);
		}
	});
	//生成html函数
	function courseList(obj) {

		$.each(obj, function(i, tiem) {
			//免费处理 保留两位小数
			tiem.price == 0 ? tiem.price = '免费' : tiem.price = tiem.price.toFixed(2);

			courseHtml += '<li class="kc-list">\
								<a href="' + tiem.providerLink + '">\
									<div class="kc">\
										<div class="l-img"><img class="middlePhotoUrl" src="' + tiem.middlePhotoUrl + '" alt="' + tiem.name + '" /></div>\
										<div class="l-txt">\
											<h3 class="">' + tiem.name + '</h3>\
											<h4 class="">' + tiem.provider + '</h4>\
											<span class="span-1"><i class="learnerCount">' + tiem.learnerCount + '</i></span>\
											<span class="span-2">￥<i class="Listprice">' + tiem.price + '</i></span>\
										</div>\
									</div>\
									<div class="kc-hover" >\
										<div class="kc-hover-top">\
											<img class="middlePhotoUrl" src="' + tiem.middlePhotoUrl + '" alt="' + tiem.name + '" />\
											<dl>\
												<h3 class="ListName">' + tiem.name + '</h3>\
												<dt><p><span class="learnerCount">' + tiem.learnerCount + '</span>在学</p></dt>\
												<dd>\
													<p>发布者：<span class="provider">' + tiem.provider + '</span></p>\
												</dd>\
												<dd>\
													<p>分类：<span class="">' + tiem.provider + '</span></p>\
												</dd>\
											</dl>\
										</div>\
										<div class="kc-hover-txt">\
											<p class="description">\
												' + tiem.description + '\
											</p>\
										</div>\
									</div>\
								</a>\
							</li>';
		});
		//插入DOM
		$('#contenr-l-list').html(courseHtml);

	}
}
course();

//热门课程
function courseHot() {
	var courseHotObj,
		courseHotHtml = '',
		courseHotList;
	$.ajax({
		type: 'get',
		url: 'http://study.163.com/webDev/hotcouresByCategory.htm',
		success: function(data) {

			//转行成对象
			courseHotObj = JSON.parse(data);
			//生成html调用
			courseHotFun(courseHotObj);
		},
		error: function(jqXHR) {
			console.log('发生错误:' + jqXHR.status);
		}
	});

	function courseHotFun(obj) {
		$.each(obj, function(i, tiem) {
			courseHotHtml += '<li>\
								<a href="' + tiem.providerLink + '">\
									<img src="' + tiem.smallPhotoUrl + '" alt="' + tiem.name + '" />\
									<h3>' + tiem.name + '</h3>\
									<span>' + tiem.learnerCount + '</span>\
								</a>\
							</li>';
		});
		$('#hotList').html(courseHotHtml += courseHotHtml);
		//热门课程循环
		var hotList = $('#hotList'),
			hotListTop = 56;
		setInterval(function() {
			if(hotList.css('top') == '-1410px') {
				hotListTop = -8;
			}
			hotListTop--;
			hotList.css('top', hotListTop + 'px')
		}, 70);
	}
}
courseHot();

//弹窗部分
var popBox = $('#pop-box');
//视频
(function videoPop() {
	var videoPopBtn = $('#video-Play'),
		video = $('#video'),
		videoOut = $('#video-off'),
		videoPlay = $('#videoPlay');
	//打开视频
	videoPopBtn.click(function() {
			popBox.css('display', 'block');
			video.css('display', 'block');
			videoPlay.trigger('play');
		})
		//关闭视频
	videoOut.click(function() {
		popBox.css('display', 'none');
		video.css('display', 'none');
		videoPlay.trigger('pause');
	})

})();

//登录弹窗
(function loginPop() {
	var loginWin = $('#login'),
		loginWinBtn = $('#gz'),
		loginOutBtn = $('#login-off'),
		loginBtn = $('#submit');
	//页面刷新自动登录
	if($.cookie('followSuc') == 'followSuc') {
		//存在
		loginWinBtn.css('display', 'none');
		$('#ygz').css('display', 'block');
	}
	login();

	//登录逻辑
	function login() {
		//弹窗登录框
		loginWinBtn.click(function() {;
				//调用判断
				loginCookie();
			})
			//关闭登录框
		loginOutBtn.click(function() {
			popBox.css('display', 'none');
			loginWin.css('display', 'none');
		})

		//登录cookie判断
		function loginCookie() {
			if($.cookie('followSuc') == 'followSuc') {
				//存在
				loginWinBtn.css('display', 'none');
				$('#ygz').css('display', 'block');

			} else {
				//不存在
				popBox.css('display', 'block');
				loginWin.css('display', 'block');
				//调用登录
				loginAjax();
			}
		}

		function loginAjax() {
			loginBtn.click(function() {
				$.ajax({
					type: 'get',
					url: 'http://study.163.com/webDev/login.htm',
					data: {
						userName: md5($('#userName').val()),
						password: md5($('#password').val())
					},
					success: function(text) {
						//						console.log(text);
						//判断登录是否成功
						if(text == 1) {
							//成功
							$('#prompt').html('登录成功！');
							$('#prompt').css('color','#1aa439');
							//延时2秒关闭登录窗口
							setTimeout(function() {
								popBox.css('display', 'none');
								loginWin.css('display', 'none');
							}, 2000);
							//写入成cookie
							$.cookie('login', 'loginSuc');
							followSuc();
						} else {
							//失败
							$('#prompt').html('登录失败！用户名或密码错误请重新登录！');

						}
					},

					error: function(jqXHR) {
						console.log('发生错误:' + jqXHR.status);
					}
				});
			})

		}
		//关注函数
		function followSuc() {
			$.ajax({
				type: 'get',
				url: 'http://study.163.com/webDev/attention.htm',
				success: function(text) {
					//判断关注是否成功
					if(text == 1) {
						//写入成cookie
						$.cookie('followSuc', 'followSuc');
						$('#ygz').css('display', 'block');
						//隐藏关注按钮
						loginWinBtn.css('display', 'none');

					}
				},

				error: function(jqXHR) {
					console.log('发生错误:' + jqXHR.status);
				}
			});
		}

	}
	$('#qxgz').click(function() {
		$.cookie('followSuc', null);
		$('#ygz').css('display', 'none');
		loginWinBtn.css('display', 'block');
	})

})();