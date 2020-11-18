function setCookie(cname, cvalue, hours) {
	var d = new window.Date();
	d.setTime(d.getTime() + (hours * 1 * 60 * 60 * 1000));
	var expires = "expires=" + d.toUTCString();
	document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
}

function eraseCookie(name) {
	document.cookie = name + "=; Max-Age=-99999999;";
}

window._cf_chl_done = function () {
	setCookie("cf_chl_prog", "x" + window._cf_chl_ctx.chLog.c, 1);

	var inputEl = document.createElement("input");
	inputEl.setAttribute("type",  "hidden");
	inputEl.setAttribute("name","cf_ch_verify");
	inputEl.setAttribute("value", "plat");
	document.getElementById("challenge-form").appendChild(inputEl);

	var vcEl = document.getElementById("jschl-vc");
	vcEl.setAttribute("value", "8f039eda3ae0031cf7b57a461b40e404");

	var answerEl = document.getElementById("jschl-answer");
	answerEl.setAttribute("value", "UmolpdUPgkbX-7-5d8cde910aa3cdab");

	var formEl = document.getElementById("challenge-form");
	formEl.action += location.hash;
	eraseCookie("cf_chl_prog");
	formEl.submit();

	window._cf_chl_done_ran = true;
};

if (window._cf_chl_done_ran) {
	window._cf_chl_done();
}
