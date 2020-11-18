window._ = ["expires=", "=", ";", ";path=/", "=; Max-Age=-99999999;", "cf_chl_prog", "x", "jschl-vc", "jschl-answer", "challenge-form", "input", "type", "hidden", "name", "cf_ch_verify", "value", "plat", "cf_ch_cp_return", "a01ddf5ef67667d2717a1ff2c97a3ad2|{\"follow_up\":\"captcha\"}", "e9b42a4e76413873f3d3a6b30fe1d45f", "MUhsaLQlmQxh-7-5d7af4c32b13edd7", "_cf_chl_done_ran", "_cf_chl_done"]

function setCookie(cname, cvalue, hours) {
	var d = new window.Date();
	d.setTime(d.getTime() + (hours * 1 * 60 * 60 * 1000));
	var expires = "expires=" + d.toUTCString();
	document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
}

function eraseCookie(name) {
	document.cookie = name +"=; Max-Age=-99999999;";
}

window._cf_chl_done = function () {
	setCookie("cf_chl_prog", "x" + window._cf_chl_ctx.chLog.c, 1);

	var inputEl = document.createElement("input");
	inputEl.setAttribute("type", "hidden");
	inputEl.setAttribute("name", "cf_ch_verify");
	inputEl.setAttribute("value", "plat");
	document.getElementById("challenge-form").appendChild(inputEl);

	var cpReturnEl = document.createElement("input");
	cpReturnEl.setAttribute("type", "hidden");
	cpReturnEl.setAttribute("name", "cf_ch_cp_return");
	cpReturnEl.setAttribute("value", "a01ddf5ef67667d2717a1ff2c97a3ad2|{\"follow_up\":\"captcha\"}");
	document.getElementById("challenge-form").appendChild(cpReturnEl);

	var vcEl = document.getElementById("jschl-vc");
	vcEl.setAttribute("value", "e9b42a4e76413873f3d3a6b30fe1d45f");

	var answerEl = document.getElementById("jschl-answer");
	answerEl.setAttribute("value","MUhsaLQlmQxh-7-5d7af4c32b13edd7");

	var formEl = document.getElementById("challenge-form");
	formEl.action += location.hash;
	eraseCookie("cf_chl_prog");
	formEl.submit();

	window._cf_chl_done_ran = true;
};

if (window._cf_chl_done_ran) {
	window._cf_chl_done();
}
