import requests
from lxml import html

#r = requests.post("http://racing.natsoft.com.au/results/")

page = requests.get('http://racing.natsoft.com.au/639825991/commands.xml')
#tree = html.fromstring(page.content)

#sData = tree.xpath('//ColumnData[@iRow=1]/text()')

print page.content
#print r.content
