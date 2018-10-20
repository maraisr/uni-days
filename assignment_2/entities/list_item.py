import tkinter as tk
from datetime import datetime
from os import listdir
from re import sub, match, search, compile
from uuid import uuid4

from web_doc_downloader import download

DATE_REGEX = r"([12]\d{3}-(0[1-9]|1[0-2])-(0[1-9]|[12]\d|3[01]))"

PREVIOUS = "previous"
CURRENT = "current"


class BaseItem:
	def __init__(self, data):
		self._data = data

		self.image = tk.PhotoImage(file="assets/%s.gif" % self.getFriendlyName())

	def getImage(self):
		return self.image

	def getLink(self):
		return self._data.get("link")

	def getName(self):
		return self._data.get("name")

	def getFriendlyName(self):
		return sub(
			r"\s",
			"_",
			self.getName().lower()
		)


class Item(BaseItem):
	def __init__(self, data, mode):
		BaseItem.__init__(self, data)

		self._data = data
		self._mode = mode

		self._tempName = "temp/%s.html" % uuid4()

	def getAge(self):
		return datetime.now() if self._mode == CURRENT else self._discoverPrevious()[0]

	def getFilename(self):
		return self._tempName if self._mode == CURRENT else self._discoverPrevious()[1]

	def getContent(self):
		if self._mode == CURRENT:
			download(self.getLink(), "downloads/%s" % self._tempName, '')

		file_stream = open("downloads/%s" % self.getFilename(), encoding="utf8", mode="r")
		content = file_stream.read()
		file_stream.close()

		return content

	def getItems(self, count=10):
		return self._data.get("parser")(self.getContent())[:count]

	def _discoverPrevious(self):
		friendlyName = self.getFriendlyName()

		currentFileLookupRegex = compile("^%s_%s\.html$" % (friendlyName, DATE_REGEX))

		currentFiles = listdir("downloads")

		maybeFile = list(filter(lambda file: match(currentFileLookupRegex, file), currentFiles))

		if len(maybeFile) < 1:
			newFileName = "%s_%s" % (friendlyName, datetime.now().strftime("%Y-%m-%d"))
			download(self.getLink(), "downloads/%s" % newFileName, "html")

			maybeFile = ["%s.html" % newFileName]

		# We only care about the first item we find
		[workingFile] = maybeFile

		nakedDate = search(compile("_(%s)" % DATE_REGEX), workingFile).group(1)

		return [
			datetime.strptime(nakedDate, "%Y-%m-%d"),
			workingFile
		]


# TODO: Comment me - refoactor this more to be more fp
class ListItem(BaseItem):

	def getPrevious(self):
		return Item(self._data, PREVIOUS)

	def getCurrent(self):
		return Item(self._data, CURRENT)
