# cfresearch
This repository contains my research from CloudFlare's AntiDDoS, JS Challenge, Captcha Challenges, and CloudFlare WAF.

This was built for educational purposes such as learning how CloudFlare works, how to bypass CloudFlare challenges, and how to prevent attacks that are bypassing CloudFlare.
> Location to [CloudFlare Scripts](https://github.com/scaredos/cfresearch/tree/master/scripts) - Credits to [devgianlu](https://github.com/devgianlu/cloudflare-bypass)

> Other relevant CloudFlare projects [[CloudProxy](https://github.com/scaredos/cloudproxy)] [[cfbypass](https://github.com/scaredos/cfbypass)]

> NEW! [Bot Detection Research](https://github.com/scaredos/bot-detection) & [Bot Detection Avoidance Research](https://github.com/scaredos/detection-avoidance)

## Challenge Information (Revisited)
- Any failed (fradulent) "final" request to solve a challenge results in a HTTP 400 response from any portion of the CF challenge, regardless of information validity, leading to the challenge restarting. 
- Referer headers should be set automatically and used accordingly to have the best chance at solving any challenge and not being detected as a bot (by new bot detection methods). 

## JS Challenge
- Base URL: `/cdn-cgi/challenge-platform/h/b` OR `/cdn-cgi/challenge-platform/h/g`
- The first request is `GET` to `BASEURL/orchestrate/jsch/v1?ray=:rayid` which replies with javascript to generate the challenege id and make the second request (to solve the challenge)
- The second request is `POST` to `BASEURL/flow/ov1/generated-challenge-id-goes-here:cf_chl_1 cookie-here/cloudflare-ray-id-goes-here/cf-challenge-id` with the POST data of `v_rayid`: `encoded information for the challenge` with the cookies `__cfuid` (CloudFlare Request ID),  `cf_chl_1` (CloudFlare Challenge 1 ID), and the new header `cf_chl_out` and `cf_chl_out_s`, which contains encoded/encrypted challenge info. The request replies with the JavaScript challenge and the cookie `cf_chl_seq_ cf-chl-1-cookie-goes-here`.
- The third request is `POST` to the same URI with the same POST data and headers but with the added cookie. The request replies with `cf_chl_rc_ni` cookie and the new header `cf-chal-out`, which is encoded or compressed.
- The final request is `POST` request to the target URL with form data of the challenge information.

- After sending the final request, you are given a new `cf_clearance` cookie and `cf_chl_prog=a9` cookie. Everytime you send a request with valid information to said URI, you are provided a new `cf_clearance` cookie regardless of the status of your previous cookie.


## Captcha Challenge
- Base URL: `/cdn-cgi/challenge-platform/h/b` OR `/cdn-cgi/challenge-platform/h/g`
- CloudFlare now requires you to also solve a JavaScript challenge in addition to the Captcha challenge, submitting them both at the same time, the first request is to `BASEURL/orchestrate/managed/v1?ray=` as you would with a JavaScript challenge.
-  The second and third request is `POST` to `BASEURL/flow/ov1/generated-challenge-id-goes-here:cf_chl_1 cookie-here/cloudflare-ray-id-goes-here/cf-challenge-id` with the POST data of `v_rayid`: `encoded information for the challenge` with the cookies `__cfuid` (CloudFlare Request ID),  `cf_chl_1` (CloudFlare Challenge 1 ID), and the new header `cf_chl_out` and `cf_chl_out_s`, which contains encoded/encrypted challenge information. The requst replies with the JavaScript challenge and the cookie `cf_chl_seq_ cf-chl-1-cookie-goes-here`. This request provides the cookie `cf_chl_rc_ni`. It also now inclues request header `cf-challenge: :challenge-id:'
- The final request is `POST` request to the target URL with form data of the challenge information.

- After sending the final request, you are given a new `cf_clearance` cookie and `cf_chl_prog=a9` cookie. Everytime you send a request with valid information to said URI, you are provided a new `cf_clearance` cookie regardless of the status of your previous cookie.

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
