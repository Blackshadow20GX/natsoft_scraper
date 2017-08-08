#For now, use this as testing platform
import subprocess
#y2006
process = ['phantomjs', 'scraper.js', 'speedway', '3', '2012']
print "Commencing PhantomJS"
subprocess.call(process)
print "Completed python script!"
