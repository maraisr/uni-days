import tkinter as tk
from datetime import datetime
from os import listdir
from re import sub, match, search, compile
from uuid import uuid4

from web_doc_downloader import download

DATE_REGEX = r"([12]\d{3}-(0[1-9]|1[0-2])-(0[1-9]|[12]\d|3[01]))"

PREVIOUS = "previous"
CURRENT = "current"


# @description
# A class that acts as the base of shared code for our lists, and is the root class - mainly static things go in here.
class AbstractBaseItem:
	def __init__(self, data):
		self._data = data

		self.staticImage = self._data.get("image")

		self.image = tk.PhotoImage(file="assets/%s.gif" % self.getFriendlyName())

	# @description
	# Gets the static external image for the list
	#
	# @getter
	#
	# @returns {string}
	def getStaticImage(self):
		return self.staticImage

	# @description
	# Gets the image of the list
	#
	# @getter
	#
	# @returns {tk.PhotoImage}
	def getImage(self):
		return self.image

	# @description
	# Gets the source link of the list
	#
	# @getter
	#
	# @returns {string}
	def getLink(self):
		return self._data.get("link")

	# @description
	# Gets the name of the list
	#
	# @getter
	#
	# @returns {string}
	def getName(self):
		return self._data.get("name")

	# @description
	# Replaces all spaces with an underscore and lowercases the name of the list.
	#
	# @returns {string} the uri compatible name of this list
	def getFriendlyName(self):
		return sub(
			r"\s",
			"_",
			self.getName().lower()
		)


# @description
# A class that houses the logic for a list, things like age computation, downloading, and content parsing.
class Item(AbstractBaseItem):
	def __init__(self, data, mode):
		AbstractBaseItem.__init__(self, data)

		self._data = data
		self._mode = mode

		# Whenever we need to operate on a temporary file for this list, use this name.
		self._tempName = "temp/%s.html" % uuid4()

	# @description
	# Gets us the age of the list.
	#
	# @getter
	#
	# @returns {datetime}
	def getAge(self):
		return datetime.now() if self._mode == CURRENT else self._discoverPrevious()[0]

	# @description
	# Gets us the filename of the list.
	#
	# @getter
	#
	# @returns {string}
	def getFilename(self):
		return self._tempName if self._mode == CURRENT else self._discoverPrevious()[1]

	# @description
	# Gets us the content of the list - for the current, it'll be a freshly downlaoded copy, and for the prvious,
	# we simply open the local html file.
	#
	# @getter
	#
	# @returns {string}
	def getContent(self):
		if self._mode == CURRENT:
			download(self.getLink(), "downloads/%s" % self._tempName, '')

		file_stream = open("downloads/%s" % self.getFilename(), encoding="utf8", mode="r")
		content = file_stream.read()
		file_stream.close()

		return content

	# @description
	# Gets us the list of items for this list, based on the result from a parser for this list style.
	#
	# @getter
	#
	# @param count {number} how many items to return send -1 to return all items
	#
	# @returns {string}
	def getItems(self, count=10):
		items = self._data.get("parser")(self.getContent())
		return items if count == -1 else items[:count]

	# @description
	# Discovers if we already have a previous html file, if not, go and download it
	# (mainly to seed the application initially). If we have a file, then return its filename, if not, then download a
	# fresh copy, and return the filename. We also return the age of the document in question.
	#
	# @private
	#
	# @returns {string}
	def _discoverPrevious(self):
		friendlyName = self.getFriendlyName()

		# a regex for what to look for
		currentFileLookupRegex = compile("^%s_%s\.html$" % (friendlyName, DATE_REGEX))

		# gets us a list of all the files in the downloads folder
		currentFiles = listdir("downloads")

		# a list of potential files, either 1 item, meaning its found, 0 if not.
		maybeFile = list(filter(lambda file: match(currentFileLookupRegex, file), currentFiles))

		# if we didnt find one, we need to go and download one
		if len(maybeFile) < 1:
			# constructs a filename for the list
			newFileName = "%s_%s" % (friendlyName, datetime.now().strftime("%Y-%m-%d"))

			# go and get it, yo!
			download(self.getLink(), "downloads/%s" % newFileName, "html")

			maybeFile = ["%s.html" % newFileName]

		# we only care about the first item we find
		[workingFile] = maybeFile

		# TODO: Get the date from the contents itself. youre safe to use the get_content method
		nakedDate = search(compile("_(%s)" % DATE_REGEX), workingFile).group(1)

		return [
			datetime.strptime(nakedDate, "%Y-%m-%d"),
			workingFile
		]


# @description
# The class used by our app, that acts as the list itself, and both its previous and current version.
# TODO: Refactor this more to be more oop, but hey it works.
class ListItem(AbstractBaseItem):

	def getPrevious(self):
		return Item(self._data, PREVIOUS)

	def getCurrent(self):
		return Item(self._data, CURRENT)
