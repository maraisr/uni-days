from datetime import datetime
from os import listdir
from re import sub, match, search, compile

from helpers.download import download

DATE_REGEX = r"([12]\d{3}-(0[1-9]|1[0-2])-(0[1-9]|[12]\d|3[01]))"


# TODO: Comment me - refoactor this more to be more fp
class ListItem:
	def __init__(self, data):
		self.link = data.get("link")
		self.name = data.get("name")
		self.imageSrc = data.get("image")
		self.parser = data.get("parser")

		# TODO: make this method take in what it needs, and make it come from helpers
		[self.age, self.filename] = self.discoverPrevious()

		self.items = False

	def getImage(self):
		return self.imageSrc

	def getLink(self):
		return self.link

	def getName(self):
		return self.name

	def getAge(self):
		return self.age

	def getFilename(self):
		return self.filename

	def getContent(self):
		return self.content

	def getItems(self, from_file=True):
		if from_file:
			# Really just a local cache
			if not self.items:
				file_stream = open("downloads/%s" % self.filename, encoding="utf8", mode="r")
				content = file_stream.read()
				file_stream.close()

				return self.parser(content)

			return self.items
		else:
			# TODO: download fresh copy, and return its items
			return self.parser()

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
