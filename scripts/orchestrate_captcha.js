var that = this || self
var queue = []

var addReadyListener = function f(q) {
	if (addEventListener) {
		document.addEventListener("DOMContentLoaded", q);
	} else {
		document.attachEvent("onreadystatechange", q)
	}
}

addReadyListener(function (q) {
	if (q["type"] === "readystatechange" && document.readyState && document.readyState !== "complete")
		return;

	that["_cf_chl_enter"]()
})

var g = function (q) {
	var r = document.createElement('a')
	r.href = q
	return r
};

queue.push(function () {
	addCookie("cf_chl_prog", 'hc', 1)
	if (that["_cf_chl_opt"]["cRq"] && that["_cf_chl_opt"]["cRq"]['ru']) {
		var t = g(atob(that["_cf_chl_opt"]["cRq"]['ru']))

		var u = t["protocol"] + '//' + t["hostname"]
		if (document.location.href.indexOf(u) !== 0) {
			var v = document.getElementById("location-mismatch-warning")
			if (v) {
				v.style.display = "block";
			} else {
				var A = document.getElementById("challenge-form");
				if (A) {
					document.getElementById("yjs-content") ?
						A["innerHTML"] += "<div class=\"cf-content\"><p style=\"background-color:#de5052;border-color:#521010;color: #fff;\" class=\"cf-alert cf-alert-error\">&#35813;&#32593;&#31449;&#36164;&#28304;&#26080;&#27861;&#36890;&#36807;&#27492;&#22320;&#22336;&#35775;&#38382;&#12290;</p></div>"
						:
						A["innerHTML"] += "<div class=\"cf-content\"><p style=\"background-color:#de5052;border-color:#521010;color: #fff;\" class=\"cf-alert cf-alert-error\">This web property is not accessible via this address.</p></div>"
				}

				var z = document.getElementById("cf-please-wait");
				if (z) z.style.display = "none"

				var y = document.getElementById("cf-content") || document.getElementById("yjs-content");
				if (y) y.style.display = "none"
			}

			addCookie("cf_chl_prog", 'hc', 'F')
			return false
		}
	}

	return true
})

that["_cf_chl_enter"] = function () {
	var s = that["_cf_chl_opt"]
	var t = "cf_chl_" + s["cvId"]
	addCookie(t, s["cHash"], 1)
	var u = document.cookie.indexOf(t) === -1 || !that.navigator.cookieEnabled
	if (u) {
		var v = document.getElementById("no-cookie-warning")
		if (v) v.style.display = "block"
		return
	}

	removeCookie("cf_chl_" + s["cvId"])
	addCookie("cf_chl_prog", 's', 1)
	for (var w = 0; w < queue.length; w++) {
		if (queue[w]() === false)
			return;
	}

	addCookie("cf_chl_prog", 'e', 1)

	var y = {}
	y["chLog"] = {'c': 0}
	y["chReq"] = s["cType"]
	y["cNounce"] = s["cNounce"]
	y['chC'] = 0
	y["chCAS"] = 0
	y['oV'] = 1
	y["cRq"] = s["cRq"]
	that["_cf_chl_ctx"] = y
	that["_cf_chl_ctx"]["chLog"][that['_cf_chl_ctx']["chLog"]['c']++] = {'start': new Date().getTime()}

	setTimeout(function () {
		var A = s["cFPWv"] ? ('h/' + s["cFPWv"] + '/') : ''
		var B = "/cdn-cgi/challenge-platform/" + A + 'generate/ov' + 1 + "/0.8803095914126589:1601298776:32517d4181ebc454ae6217601be8cd4c03a71f2c7640003025e02a624ceea408/" + s['cRay'] + '/' + s["cHash"]
		sendRequest(B)
	}, 10)
}

that["_cf_chl_done_ran"] = false
that["_cf_chl_done"] = function () {
	addCookie("cf_chl_prog", 'b', 1)
	that["_cf_chl_done_ran"] = true
}

var decodeResponse = function (n) {
	var v = 32
	var w = that["_cf_chl_opt"]["cRay"] + '_' + 0
	w.replace(/./g, function (x, z) {
		v ^= w.charCodeAt(z)
	})

	var t = []
	var u = 0
	var q = 1
	for (; q; q = n.charCodeAt(u++), !isNaN(q) && t.push(String.fromCharCode((q - v) % 65535))) ;
	return t.join('')
}

that["_cf_chl_hload"] = function () {
	that["_cf_chl_hloaded"] = true
}

queue.push(function () {
	setTimeout(function () {
		if (that["_cf_chl_hloaded"])
			return;

		var v = document.getElementById("cf-spinner-please-wait")
		if (v) v.innerHTML += "<p class=\"cf-alert cf-alert-error\">This is taking longer than expected, please reload the page.</p>"
	}, 10000)

	var s = document.createElement("script")
	s.type = "text/javascript"
	s.src = "https://hcaptcha.com/1/api.js?onload=_cf_chl_hload"
	document.getElementsByTagName("head")[0].appendChild(s)
})

var getCookie = function (name) {
	var q = name + '=';
	var r = document.cookie.split(';');

	for (var s = 0; s < r.length; s++) {
		var t;
		for (t = r[s]; t.charAt(0) == ' '; t = t.substring(1)) ;

		if (t.indexOf(q) == 0)
			return t.substring(q.length, t.length)
	}

	return ''
}

var addCookie = function (name, value, expireHours) {
	var s = new Date();
	s.setTime(s.getTime() + expireHours * 60 * 60 * 1000)
	document.cookie = name + '=' + value + ';' + "expires=" + s.toUTCString() + ";path=/"
}

var removeCookie = function (name) {
	document.cookie = name + "=; Max-Age=-99999999;";
}

var scheduleReload = function () {
	var s = parseInt(getCookie("cf_chl_rc_i"))
	if (isNaN(s)) s = 0

	var t = 1000 * Math.min(2 << s, 128)
	addCookie("cf_chl_rc_i", s + 1, 1)

	setTimeout(function () {
		document.location.reload();
	}, t)
};

this["onerror"] = function (q, r, s, t, u) {
	if (q.toLowerCase().indexOf("script error") > -1) {
		alert("Script Error: See Browser Console for Detail");
	} else {
		var z = ["Message: " + q, "URL: " + r, "Line: " + s, "Column: ", +t, "Error object: " + JSON.stringify(u)].join(" - ")
		console.log("[[[ERROR]]]:", z)
		scheduleReload()
	}

	return false
}

var sendRequest = function (q, r) {
	r = r || 0
	if (r >= 5) {
		scheduleReload()
		return
	}

	var u = false
	var v = function () {
		if (u) return;

		u = true
		setTimeout(function () {
			sendRequest(q, r + 1);
		}, 50)
	}

	var w = createRequest()
	if (!w)
		return;

	w.open("POST", q, true)
	if ("timeout" in w) {
		w.timeout = 2500
		w.ontimeout = function () {
			v()
		};
	}

	w.setRequestHeader("Content-type", "application/x-www-form-urlencoded")
	w.setRequestHeader("CF-Challenge", that["_cf_chl_opt"]["cHash"])
	w.onreadystatechange = function () {
		if (w.readyState != 4)
			return

		if (w.status != 200 && w.status != 304) {
			v()
			return
		}

		addCookie("cf_chl_prog", 'b' + that["_cf_chl_ctx"]['chLog']['c'], 1)
		new Function(decodeResponse(w.responseText))()
		addCookie("cf_chl_prog", 'a' + that["_cf_chl_ctx"]["chLog"]['c'], 1)
	}

	var y = j["compressToEncodedURIComponent"](JSON.stringify(that["_cf_chl_ctx"])).replace('+', "%2b")
	w.send('v_' + that['_cf_chl_opt']["cRay"] + '=' + y)
}

var createRequest = function () {
	if (XMLHttpRequest)
		return new XMLHttpRequest();

	if (ActiveXObject) {
		try {
			return new ActiveXObject("Microsoft.XMLHTTP")
		} catch (r) {
		}
	}

	alert("This browser is not supported.")
	scheduleReload()
}
