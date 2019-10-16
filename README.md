# cfresearch
A repository containing my research from CloudFlare's AntiDDoS, JSChallenge, and Challenges.

## Challenge (Captcha)
Cloudflare uses a script to provide access to the website while this rule is on. This is also how UAM works for CloudFlare. 
`cdn-cgi/l/chk_captcha` Is the container for the script cloudflare uses. The script, written in PHP, gives the visitor temporary access to the website with cftokens and cookies. `cdn-cgi/l/chk_captcha?s=&recaptcha_response_field=&recaptcha_challenge_field=&cv_chal_result=%&cv_chal_fp=` is the full URI for the request to the captcha. By generating random data into the fields, you could bypass the Captcha page for usage in DDoS attacks, or for web crawling.
> To Patch: Unknown

## JS Challenge
Cloudflare also implements a script to 'check' the 'browser' as an attempt to stop ddos attacks. `dn-cgi/l/chk_jschl` Is the container for the script cloudflare uses. The script, written in php, gives the visitor full access to the website if a JS Challenge is implemented using cookies and tokens. `cdn-cgi/l/chk_jschl?s=&jschl_vc=&pass=jschl_answer=`
`s=cloudflarecookie, jschl_vc=cookie, pass=randomint with last 5 rayid, jschl_answer=randomint`
> To Patch: Unknown

## Cache Bypass
Cloudflare uses Edge servers to store cache and send requests to the webserver. If the server is caching pages such as HTML or PHP, or any content available via URI, you could send a `must-revalidate`query in your header to make the Cloudflare Edge server revalidate the cache and GET a new file regardless if the file has changed or not.
> To Patch: `Remove must-revalidate or max-age from Cache-Control header`

## Authentic Traffic
To get allowed access to cloudflare regularly, you need a CloudFlare User ID cookie, labeled `__cfduid`. These can be obtained by setting the bot to allow cookies and request a cookie. Some application will require a `PHPSESSID` cookie to obtain access also.
> Patch: Limit Traffic To Webserver | RateLimiting | Limit Connections | Kill Connections
