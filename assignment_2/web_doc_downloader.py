# -----------------------------------------------------------
#
# Web Document Downloader
#
# This program contains a function to download
# and save the source code of a web document as a local
# file. Given a URL, it downloads the corresponding web
# document as a Unicode character string and saves it to
# a file.  The function also returns the downloaded
# document to the caller as a Python character string.
# NB: The function assumes the source file is encoded as
# UTF-8, which is the case for most HTML/XML documents
# on the web.
#
# Q: Why not just access the web page's source code via
# your favourite web browser (Firefox, Google Chrome, etc)?
#
# A: Because when a Python script requests a web document
# from an online server it may not receive the same file
# you see in your browser!  Many web servers generate
# different HTML/XML code for different clients.  Even
# worse, some web servers may refuse to send documents to
# programs other than standard web browsers.  If a Python
# script requests a web document they may instead respond
# with an "access denied" document!  For instance, try
# viewing the web site http://www.wayofcats.com/blog/ in
# a browser and then try downloading its contents using the
# function below.  Although you can see it in the browser
# it won't be delivered to your Python program!
#
# WARNING: This function will silently overwrite the
# target file if it already exists!
#

# -----------------------------------------------------------
#
# A function to download and save a web document. The function
# tries to produce a meaningful error message if the attempt
# fails.  WARNING: This function will silently overwrite
# the target file if it already exists!  NB: You should
# change the default filename extension to "xhtml" when
# downloading an XML document.
#
def download(url='http://www.wikipedia.org/',
             target_filename='download',
             filename_extension='html'):
	# Import the function for opening online documents
	from urllib.request import urlopen

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
		                target_file + "'")

	# Return the downloaded document to the caller
	return web_page_contents


# -----------------------------------------------------------
#
# A main program to call the function.  If you want to download a
# specific web document, add its URL as the function's argument.
#
download()
