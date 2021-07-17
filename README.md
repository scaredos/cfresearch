# cfresearch
This repository contains my research from CloudFlare's AntiDDoS, JS Challenge, Captcha Challenges, and CloudFlare WAF.

This was built for educational purposes such as learning how CloudFlare works, how to bypass CloudFlare challenges, and how to prevent attacks that are bypassing CloudFlare.
> Location to [CloudFlare Scripts](https://github.com/scaredos/cfresearch/tree/master/scripts) - Credits to [devgianlu](https://github.com/devgianlu/cloudflare-bypass)

> Other relevant CloudFlare projects [[CloudProxy](https://github.com/scaredos/cloudproxy)] [[cfbypass](https://github.com/scaredos/cfbypass)]

## Firewall Update (Managed Clearance)
- CloudFlare has introduced a new system which affects the firewall rules, and it is named "managed clearance". This new utility allows an easier usage for your users, but less security in regards to your in place firewall rules.
- Manage clearance allows your users to only solve one challenge, for a set amount of time, that clears them from all of your firewall rules (except rules where the outcome is Block). This means that if you have a JS challenge for one rule and a captcha as another, if the user completes the JS challenge, they are free to traverse your website without seeing the captcha challenge.
- However, this is based on threat score as well, if they match one block rule, or have a high threat score, this does not apply to them.



## JS Challenge
- Base URL: `/cdn-cgi/challenge-platform/h/b` OR `/cdn-cgi/challenge-platform/h/g`
- The first request is `GET` to `BASEURL/orchestrate/jsch/v1?ray=RAYID` which replies with javascript to generate the challenege id and make the second request (to solve the challenge)
- The second request is `POST` to `BASEURL/flow/ov1/generated-challenge-id-goes-here:cf_chl_1 cookie-here/cloudflare-ray-id-goes-here/cf-challenge-id` with the POST data of `v_rayid`: `encoded information for the challenge` with the cookies `__cfuid` (CloudFlare Request ID),  `cf_chl_1` (CloudFlare Challenge 1 ID), and the new header `cf-challenge`, which contains the challenge id. The request replies with the JavaScript challenge and the cookie `cf_chl_seq_ cf-chl-1-cookie-goes-here`.
- The third request is `POST` to the same URI with the same POST data and headers but with the added cookie. The request replies with `cf_chl_rc_ni` cookie and the new header `cf-chal-out`, which is encoded or compressed.
- The final request (If there is no follow up catpcha) is a `POST` request to `?__cf_chl_jschl_tk__=GENERATEd TOKEN` with the form data of

`md`: Usage is unknown at this time (Appears to be unique to every challenge)

`r`: CloudFlare Analytics (Not Required to solve challenge)

`jschl_vc`: Identity of CloudFlare JS Challenge

`jschl_answer`: JavaScript Challenge Solution

`pass`: Used in solving JavaScript Challenge

`cf_ch_verify`: `plat`

`cf_ch_cp_return`: `"ID OF CAPTCHA CHALLENGE|{\"follow_up\":\"captcha\"}"` (This is now included in the form data, it is why UAM now makes you follow up with a Captcha Challenge)

- The final request then replies with a `cf_clearance` cookie that has an unknown value (mostly likely used in logging requests)

## Captcha Challenge
- Base URL: `/cdn-cgi/challenge-platform/h/b` OR `/cdn-cgi/challenge-platform/h/g`
- CloudFlare now requires you to also solve a JavaScript challenge in addition to the Captcha challenge, submitting them both at the same time, the first request is to `BASEURL/orchestrate/captcha/v1?ray=:rayid` as you would with a JavaScript challenge.
-  The second and third request is `POST` to `BASEURL/flow/ov1/generated-challenge-id-goes-here:cf_chl_1 cookie-here/cloudflare-ray-id-goes-here/cf-challenge-id` with the POST data of `v_rayid`: `encoded information for the challenge` with the cookies `__cfuid` (CloudFlare Request ID),  `cf_chl_1` (CloudFlare Challenge 1 ID), and the new header `cf-challenge`, which contains the challenge id. The requst replies with the JavaScript challenge and the cookie `cf_chl_seq_ cf-chl-1-cookie-goes-here`. This request provides the cookie `cf_chl_rc_ni`. It also now inclues request header `cf-challenge: :challenge-id:'
- The final request is to `?__cf_chl_captcha_tk__=` with the form data of:

`r`: CloudFlare Analytics

`cf_captcha_kind`: 'h' or 're' (hCaptcha or reCaptcha)

`vc`: Identity of CloudFlare JS Challenge

`captcha_vc`: Identity of CloudFlare Captcha Challenge

`captcha_answer`: hCaptcha Captcha Answer

`cf_ch_verify`: `plat`

`h-captcha-response`: `captchka`

`cf_ch_cp_return`: `<unknown-string>|{"managed_clearance":"i"}`. This is apart of CloudFlare's new managed clearance system, which is defined more above.


- After sending the request to `?__cf_chl_captcha_tk__`, you are given a new `cf_clearance` cookie and `cf_chl_prog=a9` cookie. Everytime you send a request with valid information to said URI, you are provided a new `cf_clearance` cookie regardless of the status of your previous cookie.

## Attacks through CloudFlare
- Most commonly, if you're website is being attacked while you have CloudFlare active, it's most likely a misconfiguration on your end. Do not ratelimit CloudFlare's IPs, but to ratelimit from your webserver, you can start by `restoring visitor's IPs` then apply a firewall rule to ratelimit HTTP requests.
- For starters, you should try caching the webpage. Do not cache any pages that are dynamic to the user (login, signup, dashboard). Caching the webpage will take load off of your server and put it onto the CloudFlare network, minimizing the network traffic to your server. Argo Smart Routing can increase the load time and also help with attacks.
- If you cannot cache the content on the webpage, try CloudFlare workers to deliver dynamic content to visitors or Railgun to decrease the size of the response for dynamic content. You can combine ESI with CloudFlare workers to cache some content on a dyanmic page, decreasing the load on your webserver.

## Random Directory Attack
- Free CloudFlare cannot do much against this, but Business plans can, you can create a regexp that matches all URI on your website, and create a firewall rule to match them.
  - (Example:  `(http.request.full_uri matches "(\/)([a-z]){0,12}\w|(-)([a-z]){0,12}\w(\/)|([a-z]){0,12}\w")`)
  - You can block every request where the URI contains a number and directories with strings longer than 12 lowercase characters with no hyphens (For best results).

## Mitigating attacks
- There may be times where CloudFlare does not block an attack, and it is most likely for good reasons. When CloudFlare doesn't block an attack, it's usually because it looks like legitmate traffic. To stop this, you can configure your CloudFlare firewall rules, cache, and page rules to handle an event like this.
- You can use the firewall to send a captcha challenge to any IP with an ASN that matches that of major hosting companies (Google, Digital Ocean, Choopa, etc.). You can also block unknown bots, and turn on `Bot Fight Mode`.
- You can cache all of your static content, such as landing pages, that do not change based on the user. This will heavily protect your server against attacks that target those pages.
- With page rules, you can set `Origin Cache Control` -> `On` and `Cache Level` -> `Cache Everything` to have your web server manage which files to cache.
  - Advanced developers, who can interact with CloudFlare's API within your web application, may create an `IP List` with the corresponding account, and have those IPs be allowed to access dynamic content with no challenge. Those who are not in that list should receive some form of challenge (For logins, use JS, and make your login a static page, for other content use Captcha).
