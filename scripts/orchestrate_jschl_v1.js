var that = this || self;
var queue = [];
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
};

var addCookie = function (name, value, expireHours) {
	var s = new Date();
	s.setTime(s.getTime() + expireHours * 60 * 60 * 1000)
	document.cookie = name + '=' + value + ';' + "expires=" + s.toUTCString() + ";path=/"
};

var removeCookie = function (name) {
	document.cookie = name + "=; Max-Age=-99999999;";
};

var scheduleReload = function () {
	var p = parseInt(getCookie("cf_chl_rc_ni"));
	if (isNaN(p))
		p = 0;

	var q = 1000 * Math.min(2 << p, 128);
	addCookie("cf_chl_rc_ni", p + 1, 1);

	setTimeout(function () {
		document.location.reload()
	}, q)
};

this["onerror"] = function (msg, url, line, column, obj) {
	if (msg.toLowerCase().indexOf("script error") > -1) {
		alert("Script Error: See Browser Console for Detail");
	} else {
		var w = ["Message: " + msg, "URL: " + url, "Line: " + line, "Column: " + column, "Error object: " + JSON.stringify(obj)].join(" - ")
		console.log("[[[ERROR]]]:", w);
		scheduleReload();
	}

	return false
};

var sendRequest = function (url, retryCount) {
	retryCount = retryCount || 0;
	if (retryCount >= 5) {
		scheduleReload()
		return;
	}

	var retrying = false;
	var retry = function () {
		if (retrying) return;

		retrying = true;
		setTimeout(function () {
			sendRequest(url, retryCount + 1)
		}, 50)
	};

	var req = createRequest();
	if (!req) return;

	req.open("POST", url, true);
	if ("timeout" in req) {
		req.timeout = 2500;
		req.ontimeout = function () {
			retry();
		};
	}

	req.setRequestHeader('Content-type', "application/x-www-form-urlencoded");
	req.setRequestHeader("CF-Challenge", that["_cf_chl_opt"]["cHash"]);

	req.onreadystatechange = function () {
		if (req.readyState != 4) return;
		if (req.status != 200 && req.status != 304) {
			retry();
			return;
		}

		// Update program state with 'b'
		addCookie("cf_chl_prog", 'b' + that["_cf_chl_ctx"]["chLog"]['c'], 1)

		// Decode payload and execute it
		new Function(decodeResponse(req.responseText))()

		// Update program state with 'a'
		addCookie("cf_chl_prog", 'a' + that["_cf_chl_ctx"]["chLog"]['c'], 1)
	};

	// Create payload and send it
	var payload = compressToEncodedURIComponent(JSON.stringify(that["_cf_chl_ctx"])).replace('+', '%2b');
	req.send('v_' + that["_cf_chl_opt"]["cRay"] + '=' + payload);
};

var createRequest = function () {
	if (XMLHttpRequest)
		return new XMLHttpRequest()

	if (ActiveXObject) {
		try {
			return new ActiveXObject("Microsoft.XMLHTTP");
		} catch (r) {
		}
	}

	alert("This browser is not supported.");
	scheduleReload();
};

var lzBase64Alphabet = "yvejD7CpqOLnKRAUgWNQr2wYdIaGHZM9P5ST8shlVb6oBmfEXuiFz0J1ck3tx4"
var lzUriAlphabet = "tEM+ujl9UDp$8OwqWAKRZPSzLabg5sHIcNfQiTV-B1nXdyrCohFYxkG23J4em6v07"

var addReadyListener = function l(n) {
	if (document.addEventListener) {
		document.addEventListener("DOMContentLoaded", n)
	} else {
		document.attachEvent("onreadystatechange", n)
	}
};

addReadyListener(function (ev) {
	if (ev.type === "readystatechange" && document.readyState && document.readyState !== "complete")
		return;

	that["_cf_chl_enter"]()
});

this["_cf_chl_enter"] = function () {
	var opts = that["_cf_chl_opt"];

	// Add test cookie
	var chlCookie = "cf_chl_" + opts["cvId"];
	addCookie(chlCookie, opts["cHash"], 1);

	// Check that cookies are working
	var s = document.cookie.indexOf(chlCookie) === -1 || !that.navigator.cookieEnabled;
	if (s) {
		var r = document.getElementById("no-cookie-warning")
		if (r) r.style.display = "block"
		return void 0
	}

	// Remove test cookie
	removeCookie("cf_chl_" + opts["cvId"]);

	// Set program state to 's'
	addCookie("cf_chl_prog", 's', 1);

	// Execute everything from the queue
	for (var i = 0; i < queue.length; i++)
		queue[i]();

	// Set program state to 'e'
	addCookie("cf_chl_prog", 'e', 1);

	// Create context
	var ctx = {}
	ctx["chLog"] = {'c': 0}
	ctx["chReq"] = opts["cType"]
	ctx["cNounce"] = opts["cNounce"]
	ctx["chC"] = 0
	ctx["chCAS"] = 0
	ctx['oV'] = 1
	ctx["cRq"] = opts["cRq"]
	that["_cf_chl_ctx"] = ctx;

	// Update log with request start time
	that["_cf_chl_ctx"]["chLog"][that["_cf_chl_ctx"]['chLog']['c']++] = {
		'start': new Date().getTime()
	};

	// Send request after small delay
	setTimeout(function () {
		sendRequest("/cdn-cgi/challenge-platform/generate/ov" + 1 + "/0.6167940643061035:1600608587:7ba9d7deedd7d1cc95a452642c383762fb0e5461d197f6544f815893ef8ff305/" + opts["cRay"] + '/' + opts["cHash"])
	}, 10);
};

this['_cf_chl_done_ran'] = false;
this["_cf_chl_done"] = function () {
	// Set program state to 'b'
	addCookie("cf_chl_prog", 'b', 1);
	that["_cf_chl_done_ran"] = true
};

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
};

// Push page reload to
queue.push(function () {
	setTimeout(function () {
		that['_cf_chl_done']()
	}, 4000)
})
