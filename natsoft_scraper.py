#For now, use this as testing platform
import subprocess
#y2006
#phantomjs --web-security=no scraper.js circuit 3 2012 live
process = ['phantomjs', 'scraper.js', 'circuit', '3', '2016', 'single']
print "Commencing PhantomJS"
subprocess.call(process)
print "Completed python script!"
