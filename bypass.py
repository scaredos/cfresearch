import cfscrape
import random
s = cfscrape.create_scraper()
while 1:
    x = str(random.random())
    print s.post('https://example.com/'+x).headers

