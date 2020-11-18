window._ = ["expires=", "=", ";", ";path=/", "=; Max-Age=-99999999;", "cf_chl_prog", "f", "F", "_cf_chl_done_ran", "_cf_chl_done"]

function setCookie(cname, cvalue, hours) {
	var d = new window.Date();
	d.setTime(d.getTime() + (hours * 1 * 60 * 60 * 1000));
	var expires = "expires=" + d.toUTCString();
	document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
}

function eraseCookie(name) {
	document.cookie = name + "=; Max-Age=-99999999;";
}

setCookie("cf_chl_prog", "f" + window._cf_chl_ctx.chLog.c, 1);
window._cf_chl_done = function () {
	setCookie("cf_chl_prog", "F" + window._cf_chl_ctx.chLog.c, 1);
	window.location.reload();
};

if (window._cf_chl_done_ran) {
	window._cf_chl_done();
}
