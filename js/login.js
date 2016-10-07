//登录
//登录开始

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
	paword = document.getElementById("password"),
	//获取登录提交按钮
	loginBut = document.getElementById("submit"),
	prompt = document.getElementById('prompt'),
	loginForm = document.getElementById('form');

//登录判断loginSuc是否存在
function getLoginSuc() {

	//自动登录
	getLoginCookie();

	//登录关注cookie判断
	function getLoginCookie() {
		if(getCookie("followSuc")) {
			//cookie存在调用关注按钮

			//隐藏关注按钮
			popLogin.style.display = "none";
			//显示已关注
			ygz.style.display = "block";
			//显示目前粉丝数量
			fs.style.display = "block";
			//调用取消关注
			removeFocus();
		} else {
			//调用登录窗口关闭按钮
			loginOff.onclick = function() {
				//关闭窗口函数调用
				popOff(loginOff, loginWin);
			};
			//登录
			loginFun();
		}
	}

	//点击关注按钮
	popLogin.onclick = function() {
		getLoginCookie();
		//弹出登录窗口函数调用
		popOpen(popLogin, loginWin);
	};

}
//取消关注函数
function removeFocus() {
	var Focus = document.getElementById('qxgz');
	Focus.onclick = function() {
		//删除关注cookie
		deleteCookie('followSuc');
		popLogin.style.display = 'block';
		ygz.style.display = 'none';
	}
}
removeFocus();

getLoginSuc();

function loginFun() {
	var userVerify = false,
		pawordVerify = false;
	//登录表单验证函数

	function clickVerify() {
		if(userName.value.length > 3 && userName.value.length < 12) {
			prompt.innerHTML = '用户名符合';
			prompt.style.color = '#189f36';
			userVerify = true;
		} else {
			prompt.innerHTML = '用户名不符合！请输入3-12位用户名！';
			prompt.style.color = '';
			userVerify = false;
		}
		if(paword.value.length >= 6) {
			prompt.innerHTML = '密码符合';
			prompt.style.color = '#189f36';
			pawordVerify = true;
		} else {
			prompt.innerHTML = '密码不符合！请输入6位以上密码！';
			prompt.style.color = '';
			pawordVerify = false;

		}

	}

	function blurVerify() {
		//用户名输入框失去焦点开始验证
		userName.onblur = function() {
				if(userName.value.length > 5 && userName.value.length < 12) {
					prompt.innerHTML = '用户名符合';
					prompt.style.color = '#189f36';
					userVerify = true;
					loginBut.disabled = false;
				} else {
					prompt.innerHTML = '用户名不合法！请输入5-12位用户名！';
					prompt.style.color = '';
					userVerify = false;

				}

			}
			//密码输入框失去焦点开始验证
		paword.onblur = function() {
			if(paword.value.length >= 6 && userName.value.length > 5 && userName.value.length < 12) {
				prompt.innerHTML = '用户名和密码符合';
				prompt.style.color = '#189f36';
				pawordVerify = true;
				loginBut.disabled = false;
			} else if(userName.value.length > 5 && userName.value.length < 12) {
				prompt.innerHTML = '用户名不合法！请输入3-12位用户名！';
				prompt.style.color = '';
				userVerify = false;

			} else {
				prompt.innerHTML = '密码不符合！请输入6位以上密码！';
				prompt.style.color = '';
				pawordVerify = false;
			}
		}

	}
	blurVerify();
	//判读表单验证结果

	loginBut.onclick = function() {
		//执行验证
		clickVerify();
		if(userVerify && pawordVerify) {

			loginBut.disabled = false;
			ajax({
				method: "get", //传输方式
				url: "http://study.163.com/webDev/login.htm", //url地址
				async: true, //同步方式，true异步, false不是异步
				data: {
					userName: md5(userName.value),
					password: md5(paword.value),
				},
				success: function(text) {
					if(text == 0) {
						//登录不成功
						popBox.style.display = 'block';
						loginWin.style.display = 'block';
						prompt.style.display = 'block';
						prompt.style.color = 'red';
						prompt.innerHTML = '登录失败！用户名或密码错误请重新登录。';
					} else {
						//登录成功

						//写入登录成功cookie
						setCookie("loginSuc", "login", setCookieDate(10));
						//关闭登录窗口
						popOff(loginOff, loginWin);
						//隐藏关注按钮
						popLogin.style.display = "none";
						//发起关注请求
						ajax({
							method: 'get',
							async: true,
							url: 'http://study.163.com/webDev/attention.htm',
							success: function(text) {
								//写入关注成功cookie
								setCookie("followSuc", "followSuc", setCookieDate(10));
								//显示已关注
								ygz.style.display = "block";
							},
						});
						//显示目前粉丝数量
						fs.style.display = "block";

					}
				},

			});
		} else if(userName.value == '') {
			//表单验证为空提示信息
			prompt.style.display = 'block';
			prompt.innerHTML = '用户名或密码不能为空！';

			//阻止表单提交
			loginBut.disabled = true;

		} else {
			//提示错误
			prompt.style.display = 'block';
			prompt.innerHTML = '用户名或密码有误，请从新输入！';

			//阻止表单提交
			loginBut.disabled = true;
		}
	};

}