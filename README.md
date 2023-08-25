# cfresearch
This repository contains my research from Cloudflare's AntiDDoS, JS Challenge, Captcha Challenges, and Cloudflare WAF.

This was built for educational purposes such as learning how Cloudflare works, how to bypass Cloudflare challenges, and how to prevent attacks that are bypassing Cloudflare.
> Location to [Cloudflare Scripts](https://github.com/scaredos/cfresearch/tree/master/scripts) - Credits to [devgianlu](https://github.com/devgianlu/cloudflare-bypass)

> Other relevant Cloudflare projects [[CloudProxy](https://github.com/scaredos/cloudproxy)] [[cfbypass](https://github.com/scaredos/cfbypass)]


## Challenge information
- Headers should be set accordingly, including `referer` and `origin`
- Headless browsers should be modified to become "undetectable"

## Managed Challenge
- Base URL: `/cdn-cgi/challenge-platform/h/b` OR `/cdn-cgi/challenge-platform/h/g`
- The first request is `GET` to `BASEURL/orchestrate/chl_page/v1?ray=${rayid}` 
    - This replies with javascript to generate the challenege id and make the second request (to solve the challenge)
- The second request is `POST` to `BASEURL/flow/ov1/${unknown_here}:${unix_epoch}:${unknown_here}/${ray-id}/${cf-challenge-id}` with the POST data of `v_${rayid}`: `encoded information for the challenge` and header `cf-challenge`. 
    - The request replies with header `Cf-Chl-Gen`.
- The third request is `GET` to `
https://challenges.cloudflare.com/{BASEURL}/turnstile/if/ov2/av0/unknown/0/unknown/unknown/theme(dark)/normal`
    - For Turnstile captcha challenge
- The fourth request is `POST` to 2nd URL
    - This replies with `Cf-Chl-Gen` header
- The fifth and sixths request is `POST` to:
    - 5th: `https://challenges.cloudflare.com/{BASEURL}/flow/ov1/${unknown_here}:${unix_epoch}:${unknown_here}/${ray-id}/${cf-challenge-id}`with the POST data of `v_${rayid}`: `encoded information for the challenge` and header `Cf-Challenge`.
    - 6th: `https://DOMAIN/{BASEURL}/flow/ov1/${unknown_here}:${unix_epoch}:${unknown_here}/${ray-id}/${cf-challenge-id}`with the POST data of `v_${rayid}`: `encoded information for the challenge` and header `Cf-Challenge`.
    - These both include the referer header of the turnstile URL
- The final request is `POST` to target url with POST DATA:
    - `md`: Analytic data
    - `sh`: Challenge processing
    - `aw`: Challenge processing
    - `cf_ch_cp_return`: `unknown|{"managed_clearance":"ni"}`
    - After sending the final request, you are given a new `cf_clearance` cookie.
 
> Please be aware there is an unknown timeout (60+ seconds) for turnstile captcha in which clearance is automatically granted!!


## Random Directory Attack
- Cloudflare cannot do much against this, but you can create a regexp that matches all URI on your website, and create a firewall rule to match them.
  - (Example:  `(http.request.full_uri matches "(\/)([a-z]){0,12}\w|(-)([a-z]){0,12}\w(\/)|([a-z]){0,12}\w")`)

## Mitigating attacks
- Cloudflare mitigate attacks at the edge, often utilizing turnstile (CAPTCHA-free challenge)
- Attacks are mitigated at the edge (automatically) when:
    - Request matches (D)DoS WAF rule (Managed, SSL/TLS, Layer 4 rules)
    - Request matches user-defined rule (Firewall rule, IP/User-Agent Access rule)
    - Request matches ratelimit rule
- Attacks can be detected in the client-space then mitigated at the edge:
    - Bot fight mode (Bot detection/if enabled)
    - Page shield (if enabled)
    - Managed challenge/JS Challenge/Legacy captcha

- If attacks are not being mitigated by Cloudflare, consider the following:
    - Implement rate-limiting where neccessary (Server-side processing (POST, PUT, DELETE requests))
        - Rate-limiting on login handlers is vital (or other methods to protect spam)
    - Return managed-challenges to ASNs registered as hosting. 
    - Implement caching when possible (static pages)
      - Try Cloudflare's Railgun
        - Railgun caches the parts of webpages that are unchanged on dynamic pages (HTML of user dashboard with user's personal metrics being changes (username, etc.))
    - Contact Cloudflare
 
