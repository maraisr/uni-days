from urllib.request import urlopen


# -----Downloader Function--------------------------------------------#
#
# This is our function for downloading a web page's content and both
# saving it on a local file and returning its source code
# as a Unicode string. The function tries to produce a
# meaningful error message if the attempt fails.  WARNING: This
# function will silently overwrite the target file if it
# already exists!  NB: You should change the filename extension to
# "xhtml" when downloading an XML document.  (You do NOT need to use
# this function in your solution if you choose to call "urlopen"
# directly, but it is provided for your convenience.)
#
def download(url='http://www.wikipedia.org/',
             target_filename='download',
             filename_extension='html'):
	# Import an exception raised when a web server denies access
	# to a document
	from urllib.error import HTTPError

	# Open the web document for reading
	try:
		web_page = urlopen(url)
	except ValueError:
		raise Exception("Download error - Cannot find document at URL '" + url + "'")
	except HTTPError:
		raise Exception("Download error - Access denied to document at URL '" + url + "'")
	except:
		raise Exception("Download error - Something went wrong when trying to download " + \
		                "the document at URL '" + url + "'")

	# Read its contents as a Unicode string
	try:
		web_page_contents = web_page.read().decode('UTF-8')
	except UnicodeDecodeError:
		raise Exception("Download error - Unable to decode document at URL '" + \
		                url + "' as Unicode text")

	# Write the contents to a local text file as Unicode
	# characters (overwriting the file if it
	# already exists!)
	try:
		text_file = open(target_filename + '.' + filename_extension,
		                 'w', encoding='UTF-8')
		text_file.write(web_page_contents)
		text_file.close()
	except:
		raise Exception("Download error - Unable to write to file '" + \
		                target_filename + "'")

	# Return the downloaded document to the caller
	return web_page_contents
