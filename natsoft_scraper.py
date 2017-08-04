#For now, use this as testing platform
import subprocess

process = ['phantomjs', 'scraper.js', 'circuit', '3', 'y2006']
print "Commencing PhantomJS"
subprocess.call(process)
print "Completed python script!"
