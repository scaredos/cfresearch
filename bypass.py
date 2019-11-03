import cfscrape
import random
s = cfscrape.create_scraper()
while 1:
    x = str(random.random())
    print s.post('http://silent-uk.projectkyros.com:19999/'+x).headers

