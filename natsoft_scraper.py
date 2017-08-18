#For now, use this as testing platform
import subprocess
#y2006
process = ['phantomjs', 'scraper.js', 'circuit', '3', '2012', 'live']
print "Commencing PhantomJS"
subprocess.call(process)
print "Completed python script!"
