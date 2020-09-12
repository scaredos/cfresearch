# cfresearch
This repository contains my research from CloudFlare's AntiDDoS, JS Challenge, Captcha Challenges, and CloudFlare WAF.
This was built for educational purposes such as learning how CloudFlare works, how to bypass CloudFlare challenges, and how to prevent attacks that are bypassing CloudFlare.
> Contact Me: [Telegram](https://t.me/trespassed) | The old information is at [OLD.md](https://github.com/scaredos/cfresearch/blob/master/OLD.md)

## New Cookie with UAM
- CloudFlare has recently introduced a new cookie required to solve their challenges. The `cf_chl_prog` cookie which is provided at the generation of a challenge. Once you solve the challenge, you are provided 2 digits to add to the end of the cookie. A sample value would look like `a19`.

## UAM Captcha Follow Up
- CloudFlare has implemented a follow up after solving the JS Challenge for some users. CloudFlare now requires you to solve a captcha after solving the JS Challenge when the user has UAM enabled. For the first challenge, CloudFlare has introduced these two new items
- New Cookie
`cf_chl_1`: `id-of-challenge`

- New Form Data
`cf_ch_cp_return`: `id-goes-here|{"follow_up":"captcha"}`

- If there is not a `cf_ch_cp_return` item in the form data, there is no follow up Captcha. 

## Captcha Challenge
- CloudFlare now requires you to also solve a JavaScript challenge in addition to the Captcha challenge, submitting them both at the same time, the first request is to `/cdn-cgi/challenge-platform/orchestrate/captcha/v1` as you would with a JavaScript challenge.
- The second request is `POST` to `cdn-cgi/challenge-platform/generate/ov1/generated-challenge-id-goes-here/cloudflare-ray-id-goes-here/cf_chl_1 cookie-here` with the POST data of `v_ray-id-goes-here`: `encoded information for the challenge` with the cookies `__cfuid` (CloudFlare Request ID), and `cf_chl_1` (CloudFlare Challenge 1 ID). The requst replies with the JavaScript challenge and the cookie `cf_chl_seq_ cf-chl-1-cookie-goes-here`.
- The final request is to `?__cf_chl_captcha_tk__=` with the form data of:

`r`: CloudFlare Analytics

`cf_captcha_kind`: 'h' or 're' (hCaptcha or reCaptcha)

`vc`: Identity of CloudFlare JS Challenge

`captcha_vc`: Identity of CloudFlare Captcha Challenge

`captcha_answer`: hCaptcha Captcha Answer

`cf_ch_verify`: `plat`

`h-captcha-response`: `captchka`

- After sending the request to `?__cf_chl_captcha_tk__`, you are given a new cf_clearance cookie. Everytime you send a request with valid information to said URI, you are provided a new cf_clearance cookie regardless of the status of your previous cookie.


## JS Challenge
- The first request is `GET` to `cdn-cgi/challenge-platform/orchestrate/jsch/v1` which replies with javascript to generate the challenege id and make the second request
- The second request is `POST` to `cdn-cgi/challenge-platform/generate/ov1/generated-challenge-id-goes-here/cloudflare-ray-id-goes-here/cf_chl_1 cookie-here` with the POST data of `v_ray-id-goes-here`: `encoded information for the challenge` with the cookies `__cfuid` (CloudFlare Request ID), and `cf_chl_1` (CloudFlare Challenge 1 ID). The requst replies with the JavaScript challenge and the cookie `cf_chl_seq_ cf-chl-1-cookie-goes-here`.
- The third request is `POST` to the same URI with the same POST data but with the added cookie. The request replies with `cf_chl_rc_ni` cookie.
- The final request (If there is no follow up catpcha) is a `POST` request to `?__cf_chl_jschl_tk__=GENERATEd TOKEN` with the form data of 

`r`: CloudFlare Analytics (Not Required to solve challenge)

`jschl_vc`: Identity of CloudFlare JS Challenge

`jschl_answer`: JavaScript Challenge Solution

`pass`: Used in solving JavaScript Challenge

`cf_ch_verify`: `plat`

`cf_ch_cp_return`: `"ID OF CAPTCHA CHALLENGE|{\"follow_up\":\"captcha\"}"` (This is now included in the form data, it is why UAM now makes you follow up with a Captcha Challenge)

- The final request then replies with a `cf_clearance` cookie that has an unknown value (mostly likely used in logging requests)


## Attacks through CloudFlare
- Most commonly, if you're website is being attacked while you have CloudFlare active, it's most likely a misconfiguration on your end. Do not ratelimit CloudFlare's IPs, but to ratelimit from your webserver, you can start by `restoring visitor's IPs` then apply a firewall rule to ratelimit HTTP requests. For starters, you should try caching the webpage. Do not cache any pages that require authentication such as a dashboard and a login or signup form. Caching the webpage will take load off of your server and put it onto the CloudFlare network, minimizing the network traffic to your server. Argo Smart Routing can increase the load time and also help with attacks. Argo Smart Routing reduces the requests to the web server.
- If you cannot cache the content on the webpage, try CloudFlare workers to deliver dynamic content to visitors or Railgun to decrease the size of the response for dynamic content. You can combine ESI with CloudFlare workers to cache some content on a dyanmic page, decreasing the load on your webserver. 

## Random URI in the attack
- When there is a random URI in the attack, it's an attempt to stress your webserver. You can cache the 404 page so CloudFlare will deliver the 404 content instead of your webserver. You can whitelist all URIs you use on your website in the CloudFlare firewall, then block everything else. Let's say you only use '/admin/' and '/home'. You can set a firewall rule "if not /home/ in URI" to block or captcha challenge the traffic. This is only a slight fix of course, if someone notices this, then they can do /home/random/random. 

## Patching the attacks
- CloudFlare can only do so much to block attacks. If the attack is large enough, there is probably nothing CloudFlare can do about this attack. With residential proxies, constantly resetting user-agents, and other randomized attributes that prevent CloudFlare from fingerprinting requests/devices and apply mitigation or an IP jail.
- Look for patterns in the attacks, such as proxies, user agents, ip ranges/asn, etc. Usually this data is randomized by using a proxy pool or list and generating pseudo-random user agents to abuse. If it is a specific ASN such as Digital Ocean being abused, send a Catpcha challenge to that ASN and it should drop the attack. Most attacks can only "bypass" the JavaScript challenge as solving the Captcha challenge requires a paid service or a unqiue bypass.
