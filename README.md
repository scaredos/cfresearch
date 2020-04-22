# cfresearch
This repository contains my research from CloudFlare's AntiDDoS, JS Challenge, Captcha Challenges, and CloudFlare WAF.
This was built for educational purposes such as learning how CloudFlare works, how to bypass CloudFlare challenges, and how to prevent attacks that are bypassing CloudFlare.
> Contact Me: [Telegram](https://t.me/trespassed) | The old information is at [OLD.md](https://github.com/scaredos/cfresearch/blob/master/OLD.md)

## Privacy Pass w/ hCaptcha
CloudFlare has switched from reCaptcha to hCaptcha. hCaptcha now supports Privacy Pass. Head to https://www.hcaptcha.com/privacy-pass and claim 5 tokens each time you solve.

## CloudFlare hCaptcha Challenge
The URI has not changed, but the POST data has. hCaptcha is the replacement for reCaptcha. hCaptcha uses the users input to train machine learning modles and neural networks, making the businesses that own the models pay the website owner.

`r`: CloudFlare Analytics (Not required to solve challenge)

`cf_catpcha_kind`: 'h' or 're' (hCaptcha or reCaptcha)

`id`: CloudFlare's ID of the request

`g-captcha-response`: Response of hCaptcha or reCaptcha

`h-captcha-response`: Response of hCaptcha or reCaptcha

## Captcha Challenge
- The new CloudFlare captcha challenge was introduced early this year in an attempt to stop the CloudFlare "bypasses".
- The new method is `POST` to `?__cf_chl_catpcha_tk__=GENERATED_TOKEN`. It hands a `cf_clearance` cookie, allowing the user to freely load the website without the captcha, and a `__cfuid` cookie stating the CloudFlare visitor ID. 

## JS Challenge
- This is used for UAM (Under Attack Mode)
- CloudFlare implements a "Browser Check" to generate a token for CloudFlare clearance. Upon solving the JS Challenge, the solver is given a `__cfuid` cookie stating the CloudFlare visitor ID and a `cf_clearance` cookie to freely load the website with another challenge. The URI is `?__cf_chl_jschl_tk__=GENERATED_TOKEN` and no longer `/cdn-cgi/`.

`r`: CloudFlare Analytics (Not required to solve challenge)

`jschl_vc`: Identity of CloudFlare JS challenge

`jschl_answer`: JavaScript challenge solution

`pass`: Used in solving JavaScript Challenge

## Attacks through CloudFlare
- Most commonly, if you're website is being attacked while you have CloudFlare active, it's most likely a misconfiguration on your end. Do not ratelimit from your server, as you will just ratelimit CloudFlare's requests. For starters, you should try caching the webpage. Do not cache any pages that require authentication such as a dashboard and a login or signup form. Caching the webpage will take load off of your server and put it onto the CloudFlare network, minimizing the network traffic to your server. Argo Smart Routing can increase the load time and also help with attacks. Argo Smart Routing reduces the requests to the web server.
- If you cannot cache the content on the webpage, try CloudFlare workers to deliver dynamic content to visitors or Railgun to decrease the size of the response for dynamic content. You can combine ESI with CloudFlare workers to cache some content on a dyanmic page, decreasing the load on your webserver. 

## Random URI in the attack
- When there is a random URI in the attack, it's an attempt to stress your webserver. You can cache the 404 page so CloudFlare will deliver the 404 content instead of your webserver. You can whitelist all URIs you use on your website in the CloudFlare firewall, then block everything else. Let's say you only use '/admin/' and '/home'. You can set a firewall rule "if not /home/ in URI" to block or captcha challenge the traffic. This is only a slight fix of course, if someone notices this, then they can do /home/random/random. 

## Patching the attacks
- Look for patterns in the attacks, such as proxieds, user agents, ip ranges/asn, etc. Usually this data is randomized by using a proxy pool or list and generating pseudo-random user agents to abuse. If it is a specific ASN such as Digital Ocean being abused, send a Catpcha challenge to that ASN and it should drop the attack. Most attacks can only "bypass" the JavaScript challenge as solving the Captcha challenge requires a paid service or a unqiue bypass. Although with the introduction of hCaptcha, I have not seen any captcha "bypass" attacks.
