# cfresearch
This repository contains my research from CloudFlare's AntiDDoS, JS Challenge, Captcha Challenges, and CloudFlare WAF.

This was built for educational purposes such as learning how CloudFlare works, how to bypass CloudFlare challenges, and how to prevent attacks that are bypassing CloudFlare.
> Contact Me: [Telegram](https://t.me/pelicans) or [Email](mailto:scared@tuta.io)

> Location to [CloudFlare Scripts](https://github.com/scaredos/cfresearch/tree/master/scripts)

> Other relevant CloudFlare projects [[CloudProxy](https://github.com/scaredos/cloudproxy)] [[cfbypass](https://github.com/scaredos/cfbypass)]

## Captcha Challenge
- Base URL: `/cdn-cgi/challenge-platform/h/b` OR `/cdn-cgi/challenge-platform/h/g`
- CloudFlare now requires you to also solve a JavaScript challenge in addition to the Captcha challenge, submitting them both at the same time, the first request is to `BASEURL/orchestrate/captcha/v1?ray=:rayid` as you would with a JavaScript challenge.
- The send and third is `POST` to `BASEURL/flow/ov1/generated-challenge-id-goes-here:cf_chl_1 cookie-here/cloudflare-ray-id-goes-here/unknown-string` with the POST data of `v_rayid`: `encoded information for the challenge` with the cookies `__cfuid` (CloudFlare Request ID), and `cf_chl_1` (CloudFlare Challenge 1 ID). The requst replies with the JavaScript challenge and the cookie `cf_chl_seq_ cf-chl-1-cookie-goes-here`. This request provides the cookie `cf_chl_rc_ni`. It also now inclues request header `cf-challenge: :challenge-id:'
- The final request is to `?__cf_chl_captcha_tk__=` with the form data of:

`r`: CloudFlare Analytics

`cf_captcha_kind`: 'h' or 're' (hCaptcha or reCaptcha)

`vc`: Identity of CloudFlare JS Challenge

`captcha_vc`: Identity of CloudFlare Captcha Challenge

`captcha_answer`: hCaptcha Captcha Answer

`cf_ch_verify`: `plat`

`h-captcha-response`: `captchka`

- After sending the request to `?__cf_chl_captcha_tk__`, you are given a new `cf_clearance` cookie and `cf_chl_prog=a9` cookie. Everytime you send a request with valid information to said URI, you are provided a new `cf_clearance` cookie regardless of the status of your previous cookie.


## JS Challenge
- Base URL: `/cdn-cgi/challenge-platform/h/b` OR `/cdn-cgi/challenge-platform/h/g`
- The first request is `GET` to `BASEURL/orchestrate/jsch/v1?ray=RAYID` which replies with javascript to generate the challenege id and make the second request (to solve the challenge)
- The second request is `POST` to `BASEURL/flow/ov1/generated-challenge-id-goes-here:cf_chl_1 cookie-here/cloudflare-ray-id-goes-here/unknown-string` with the POST data of `v_rayid`: `encoded information for the challenge` with the cookies `__cfuid` (CloudFlare Request ID), and `cf_chl_1` (CloudFlare Challenge 1 ID). The requst replies with the JavaScript challenge and the cookie `cf_chl_seq_ cf-chl-1-cookie-goes-here`.
- The third request is `POST` to the same URI with the same POST data but with the added cookie. The request replies with `cf_chl_rc_ni` cookie and the new header `cf-chal-out`, which is encoded or compressed.
- The final request (If there is no follow up catpcha) is a `POST` request to `?__cf_chl_jschl_tk__=GENERATEd TOKEN` with the form data of 

`r`: CloudFlare Analytics (Not Required to solve challenge)

`jschl_vc`: Identity of CloudFlare JS Challenge

`jschl_answer`: JavaScript Challenge Solution

`pass`: Used in solving JavaScript Challenge

`cf_ch_verify`: `plat`

`cf_ch_cp_return`: `"ID OF CAPTCHA CHALLENGE|{\"follow_up\":\"captcha\"}"` (This is now included in the form data, it is why UAM now makes you follow up with a Captcha Challenge)

- The final request then replies with a `cf_clearance` cookie that has an unknown value (mostly likely used in logging requests)


## Attacks through CloudFlare
- Most commonly, if you're website is being attacked while you have CloudFlare active, it's most likely a misconfiguration on your end. Do not ratelimit CloudFlare's IPs, but to ratelimit from your webserver, you can start by `restoring visitor's IPs` then apply a firewall rule to ratelimit HTTP requests. 
- For starters, you should try caching the webpage. Do not cache any pages that are dynamic to the user (login, signup, dashboard). Caching the webpage will take load off of your server and put it onto the CloudFlare network, minimizing the network traffic to your server. Argo Smart Routing can increase the load time and also help with attacks.
- If you cannot cache the content on the webpage, try CloudFlare workers to deliver dynamic content to visitors or Railgun to decrease the size of the response for dynamic content. You can combine ESI with CloudFlare workers to cache some content on a dyanmic page, decreasing the load on your webserver. 

## Random URI in the attack
- Free CloudFlare cannot do much against this, but Business plans can, you can create a regexp that matches all URI on your website, and create a firewall rule to match them. With a rule such as `(not http.request.full_uri matches "(\/)([a-z]){0,12}\w|(-)([a-z]){0,12}\w(\/)|([a-z]){0,12}\w")`, you can block every request where the URI contains a number and directories with strings longer than 12 lowercase characters.

## Patching the attacks
- CloudFlare can only do so much to block attacks. If the attack is large enough, there is probably nothing CloudFlare can do about this attack. With residential proxies, constantly chaning user-agents, and other randomized attributes that prevent CloudFlare from fingerprinting requests/devices and apply mitigation or an IP jail.
- Look for patterns in the attacks, such as proxies (hosting), user agents, ip ranges/asn, headers, URI. Usually this data is randomized by using a proxy pool or list and generating pseudo-random user agents and URI/query string to abuse. If it is a specific ASN such as Digital Ocean being abused, require a Catpcha challenge to that ASN and it should drop the attack. Most attacks can only "bypass" the JavaScript challenge as solving the Captcha challenge requires a paid service or a unqiue bypass.
