from datetime import datetime
from os import listdir
from re import sub, match, search, compile

from helpers.download import download

DATE_REGEX = r"([12]\d{3}-(0[1-9]|1[0-2])-(0[1-9]|[12]\d|3[01]))"


# TODO: Comment me
class ListItem:
	def __init__(self, data):
		self.link = data.get("link")
		self.name = data.get("name")

		self.age = self.discoverPrevious()

	def getLink(self):
		return self.link

	def getName(self):
		return self.name

	def getAge(self):
		return self.age

	# TODO: Comment me
	def discoverPrevious(self):
		friendlyName = sub(
			r"\s",
			"_",
			self.getName().lower()
		)

		currentFileLookupRegex = compile("^%s_%s\.html$" % (friendlyName, DATE_REGEX))

		currentFiles = listdir("downloads")

		maybeFile = list(filter(lambda file: match(currentFileLookupRegex, file), currentFiles))

		if (len(maybeFile) < 1):
			newFileName = "%s_%s" % (friendlyName, datetime.now().strftime("%Y-%m-%d"))
			download(self.getLink(), "downloads/%s" % newFileName, "html")

			maybeFile = ["%s.html" % newFileName]

		# We only care about the first item we find
		[workingFile] = maybeFile

		nakedDate = search(compile("_(%s)" % (DATE_REGEX)), workingFile).group(1)

		return datetime.strptime(nakedDate, "%Y-%m-%d")