## Layer4 CloudFlare Bypass
- Ways to bypass CloudFlare and obtain origin server ip
> Contact Me: https://twitter.com/FuckBinary | https://t.me/trespassed | SmallDoink#0666

## DNS Record A
- One common way of attempting to find the origin server IP is through active DNS records. The 'A' Record holds the Origin server IP, if it's not a CloudFlare IP. 
- CloudFlare has fixed this issue recently, by securing DNS and changing DNS records setting it to one if it's IPs.
> https://github.com/scaredos/cfbypass <-- Good DNS Resolver in Python for Bypassing Cloudflare

## DNSDumpster
- Another way of attempting to find the origin server IP is through DNS servers. This lists all DNS records of the server, where subdomains like 'ssh' or 'mail' can expose the Origin Server IP.
> https://dnsdumpster.com

## CrimeFlare
- Crimeflare uses DNS records, and other methods to obtain the Origin Server IP. It also holds old records of the Website's origin IP. This is the most effective way to bypass cloudflare on websites, considering it is very easy for crimeflare to obtain this information. CrimeFlare uses modified HTTP Headers, DNS, and PHP test scripts to grab the IP behind cloudflare.
> http://crimeflare.org:82

## Censys
- Censys uses a range of scanners to scan devices, much like `shodan.io`. However, with Censys, you can search domains, such as google.com, and 25% of the time, receive the IP behind cloudflare. It uses scanners, http crawlers, and various methods to obtain the IP. They scan the entire internet for servics using common protocols such as HTTP/S, FTP, SSH, RDP, and much more.
> https://censys.io/
> ``NOTE: 25% is not accurate math, just a guess``
