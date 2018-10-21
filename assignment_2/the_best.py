# -----Statement of Authorship----------------------------------------#
#
#  This is an individual assessment item.  By submitting this
#  code I agree that it represents my own work.  I am aware of
#  the University rule that a student must not act in a manner
#  which constitutes academic dishonesty as stated and explained
#  in QUT's Manual of Policies and Procedures, Section C/5.3
#  "Academic Integrity" and Section E/2.1 "Student Code of Conduct".
#
#    Student no: n8911495
#    Student name: Petrus Marais Rossouw
#
#  NB: Files submitted without a completed copy of this statement
#  will not be marked.  Submitted files will be subjected to
#  software plagiarism analysis using the MoSS system
#  (http://theory.stanford.edu/~aiken/moss/).
#
# --------------------------------------------------------------------#


# -----Assignment Description-----------------------------------------#
#
#  The Best, Then and Now
#
#  In this assignment you will combine your knowledge of HTMl/XML
#  mark-up languages with your skills in Python scripting, pattern
#  matching, and Graphical User Interface design to produce a useful
#  application that allows the user to preview and print lists of
#  top-ten rankings.  See the instruction sheet accompanying this
#  file for full details.
#
# --------------------------------------------------------------------#

import tkinter as tk
import webbrowser
from datetime import datetime
from functools import partial
from os import listdir, path
from re import IGNORECASE, findall, sub, compile, match, search
from sqlite3 import connect
from urllib.request import pathname2url
from uuid import uuid4

from web_doc_downloader import download

CURRENT = "current"
PREVIOUS = "previous"

DATE_REGEX = r"([12]\d{3}-(0[1-9]|1[0-2])-(0[1-9]|[12]\d|3[01]))"


# TODO:
# [x] you select a "old" saved copy and preview it (heading, as a tk.Label, and a numbered list)
# [x] you select a "live" copy and preview it (heading, as a tk.Label, and a numbered list)
# [x] you get to export either a live, or previous copy (html export)
# [x] get a logo in there
# [x] get all the images working
# [x] popular music parser written
# [x] popular movies parser written
# [x] you could current the live copy to a sqlite db
# [x] you could previous the live copy to a sqlite db
# [x] An image characterising the list, downloaded from online when the generated HTML document is viewed (i.e., not from a local file on the host computer).
# [ ] code cleanup
# [ ] comment everything
# [x] move everything to the one file
# [x] rename entry to "the_best.py"
# [ ] check that all things are done for the assignment
# [ ] (maybe) The publication date for the list, extracted from the source document (not just the date when the file was downloaded because they may not be the same).

# ---------------------------------------------------------------------------------------------------------------------#
# Entities
# ---------------------------------------------------------------------------------------------------------------------#


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


# ---------------------------------------------------------------------------------------------------------------------#
# Components
# ---------------------------------------------------------------------------------------------------------------------#

# @description
# A UI component render class that houses the logic for our header, which extends the tkinter Frame widget.
class Header(tk.Frame):
	def __init__(self, *args, **kwargs):
		tk.Frame.__init__(self, *args, **kwargs)

		# Renders the header as is in time of initialization.
		self.grid(pady=15)

		# tkinter's PhotoImage losses its image, when its not defined to a method that get's garbage collected, so
		# keep this reference on this class, so we have it until we destruct this header.
		#   Small gotcha with PhotoImage
		self.logo_definition = tk.PhotoImage(file="assets/logo.gif")

		tk.Label(self, image=self.logo_definition, justify=tk.CENTER) \
			.grid(row=0, column=0)


# @description
# A UI component render class that houses the logic for our menu, the three frames you'll find visually. This extends
# the tkinter Frame widget.
class Menu(tk.Frame):
	def __init__(self, parent, *args, **kwargs):
		tk.Frame.__init__(self, parent, *args, **kwargs)

		# Renders this component as is, when its initialized.
		self.grid(row=1, column=2)

		# This is the so called entry point for our data for the app. This method could in the future, get its data from
		# a db, or config file of some nature. @see #data.get_data
		self._data = get_data()

		# ... and finally, we render out our data.
		self.render(
			map(NavItem, self._data)
		)

	# @description
	# A method that when called passing in a collection of list_items, renders them one after the other.
	#
	# @see #entities.list_item.ListItem
	#
	# @param nav_items {[ListItem]} a collection of items to render
	#
	# @returns {void}
	def render(self, nav_items: [ListItem]):
		for (idx, item) in enumerate(nav_items):
			item.render().grid(in_=self, row=0, column=idx, padx=10)


# @description
# A UI component render class that houses the logic for each of our nav items, that appear in the menu. Each nav item
# extends the tkinter Frame widget.
class NavItem(tk.Frame):
	def __init__(self, list_item: ListItem, *args, **kwargs):
		tk.Frame.__init__(self, *args, **kwargs)

		# For some ui "goodness" we sink the frame
		self.config(relief=tk.SUNKEN, bd=2)

		# To track if the user wants the previous or the current list
		self.previous_current = tk.StringVar(self)
		self.previous_current.set(PREVIOUS)

		# Simply to track the item in our class
		self._item = list_item

		# Some ui references - like stated in the header, we need the image to remain in tack and not garbage collected
		# for the lifetime of this instance.
		self.image = self._item.getImage()
		self.name = self._item.getName()

	# @description
	# As the concept of using the same class to track the previous and current list, this method is a mere after thought
	# that is used to return either the previous or current list class, depending on a string.
	#
	# @see #entities.list_item.{CURRENT, PREVIOUS}
	# @see #entities.list_item.Item
	#
	# @param which {string} return the CURRENT, or the PREVIOUS
	#
	# @returns {Item} the item based off the CURRENT, or PREVIOUS
	def _get_previous_or_current_node(self, which: str):
		return self._item.getCurrent() if which == CURRENT else self._item.getPrevious()

	# @description
	# An action method, that when called opens a new child window, and renders the Preview component in it.
	#
	# @see #components.preview.Preview
	#
	# @param which {string} show me the CURRENT, or the PREVIOUS
	#
	# @returns {void}
	def _action_preview(self, which: str):
		# create a new window, then pass a lambda that renders a component in it
		NewWindow("Preview | %s" % self.name) \
			.render(partial(Preview, list_item=self._get_previous_or_current_node(which)))

	# @description
	# An action method, that when called triggers a html export of the "which" parameter for this list. And then also
	# opens the constructed html in the operating systems default browser.
	#
	# @see #helpers.construct_html.construct_html
	#
	# @param which {string} show me the CURRENT, or the PREVIOUS
	#
	# @returns {void}
	def _action_export(self, which: str):
		html = construct_html(self._get_previous_or_current_node(which))

		# TODO: Pick a better export name here
		filename = "downloads/temp/%s.html" % uuid4()
		tempfile = open(filename, "x")  # x == write mode
		tempfile.write(html)
		tempfile.close()

		# opens this file in the operating systems default browser.
		webbrowser.open('file:%s' % pathname2url(path.abspath(filename)))

	# @description
	# An action method, that when called saves the selected list to the sqlite database for further querying.
	#
	# @see #helpers.db.save_to_db
	#
	# @param which {string} show me the CURRENT, or the PREVIOUS
	#
	# @returns {void}
	def _action_save(self, which: str):
		save_to_db(self._get_previous_or_current_node(which))

	# @description
	# A method that renders servers as the single point where we define sub widgets this component renders.
	#
	# @returns {NavItem}
	def render(self):
		# The image of this list
		tk.Label(self, image=self.image) \
			.grid(row=0, column=0, columnspan=2)

		# This list's name
		tk.Label(self, text=self.name, font=("Arial", 10, "bold"), justify=tk.CENTER, anchor=tk.W) \
			.grid(row=1, column=0, columnspan=2)

		# A group of 2 radio buttons, that allow the user to toggle the previous list, or the current list
		tk.Radiobutton(self, text="Previous", variable=self.previous_current, value=PREVIOUS) \
			.grid(row=3, column=0)
		tk.Radiobutton(self, text="Current", variable=self.previous_current, value=CURRENT) \
			.grid(row=3, column=1)

		# Our action buttons:
		# Preview - shows the serious list items in a new tkinter window
		tk.Button(self, text="Preview", command=lambda: self._action_preview(self.previous_current.get())) \
			.grid(row=4, column=0)

		# Exports - generates a html file export of the currently selected list
		tk.Button(self, text="Export", command=lambda: self._action_export(self.previous_current.get())) \
			.grid(row=4, column=1)

		# Save - saves the current selected list to the sqlite db
		tk.Button(self, text="Save", command=lambda: self._action_save(self.previous_current.get())) \
			.grid(row=5, column=0, columnspan=2)

		return self


# TODO: Comment me
class Preview(tk.Frame):
	def __init__(self, container, list_item: Item, *args, **kwargs):
		tk.Frame.__init__(self, container, *args, **kwargs)

		self.pack(expand=1, fill=tk.BOTH)

		self.image = list_item.getImage()

		tk.Label(self, image=self.image) \
			.grid(row=0, column=0, rowspan=2)

		tk.Label(self, text=list_item.getName(), font=("Arial", 12, "bold")) \
			.grid(row=0, column=1)

		preview_list = tk.Frame(self)
		preview_list.grid(row=1, column=1)

		for (idx, (name, image)) in enumerate(list_item.getItems()):
			tk.Label(preview_list, text="[%s] %s" % (idx + 1, name)).grid(row=idx, column=0, sticky=tk.W)


# ---------------------------------------------------------------------------------------------------------------------#
# Parsers
# ---------------------------------------------------------------------------------------------------------------------#

# TODO: Comment
def parse_popular_games(content: str):
	title_regex = compile(r"<span\sclass=.title[^>]+>([^<]+)", IGNORECASE)

	image_regex = compile(r"col\ssearch_capsule.*img\ssrc=['\"](.*)['\"]", IGNORECASE)

	results = map(partial(findall, string=content), [title_regex, image_regex])

	return list(zip(*results))


# TODO: Comment
def parse_popular_movies(content: str):
	titles_regex = compile(r"<a\s.*(?=title\sresult)[^>]+>([^<]+)", IGNORECASE)
	images_regex = compile(r"<img\sclass=.poster.*(?=data-src)data-src=.([^'\"]+)", IGNORECASE)

	results = map(partial(findall, string=content), [titles_regex, images_regex])

	return list(zip(*results))


# TODO: Comment
def parse_popular_music(content: str):
	song_name = compile(r"<div\sclass=.item-title[^>]+>([^<]+)", IGNORECASE)
	artist_name = compile(r"<div\sclass=.artist-name[^>]+>([^<]+)", IGNORECASE)

	image_regex = compile(r"<img\ssrc=.(?=[^\"']+coverart)([^\"']+)", IGNORECASE)

	(song_names, artist_names, images) = list(
		map(partial(findall, string=content), [song_name, artist_name, image_regex])
	)

	# Now we need to zip the song_name and the artist_name in a str

	return list(zip(
		map(
			lambda node: "%s - %s" % node,
			zip(song_names, artist_names)
		),
		images
	))


# ---------------------------------------------------------------------------------------------------------------------#
# Helpers
# ---------------------------------------------------------------------------------------------------------------------#

# TODO: Comment
def construct_html(list_item: Item):
	TEMPLATE = """

	<html>

		<head>
			<title>%s</title>
			<link rel="stylesheet" href="http://stackpath.bootstrapcdn.com/bootstrap/4.1.3/css/bootstrap.min.css">
		</head>

		<body>
			<div class="container">
				%s
			</div>
		</body

	</html>

	"""

	_heading = "<h1 class=\"display-4\">{:s}</h1>".format(list_item.getName())

	filepath = "downloads/{:s}".format(list_item.getFilename())
	_filename = "<p>Filename: <i><a href='%s' target='_blank'>%s</a></i></p>" % (
		('file:{:s}'.format(pathname2url(path.abspath(filepath)))),
		("downloads/{:s}".format(list_item.getFilename()))
	)

	_date = "<p>Date published: <i>{:s}</i></p>".format(list_item.getAge().strftime("%d/%m/%Y"))

	_image = "<p><img src='{:s}' style='width: 100%' /></p>".format(list_item.getStaticImage())

	_top_ten_row_template = "<tr><td>%s</td><td>%s</td><td><img src='%s' /></td></tr>"
	_top_ten = """
		<table class="table">
			<thead>
				<tr>
					<th>Position</th>
					<th>Name</th>
					<th>Image</th>
				</tr>
			</thead>
			<tbody>
				{:s}
			</tbody>
		</table>
	""".format(''.join([
		_top_ten_row_template % (idx + 1, name, image) for (idx, (name, image)) in enumerate(list_item.getItems())
	]))

	return TEMPLATE % (
		list_item.getName(),
		('</br>'.join([_heading, _filename, _date, _image]) + '</hr>' + _top_ten)
	)


# TODO: Comment
def save_to_db(list_item: Item):
	db_instance = connect("top_ten.db")

	sql_to_run = []
	for (key, (name, image)) in enumerate(list_item.getItems()):
		sql_to_run.append((list_item.getAge().strftime("%d/%m/%Y"), key + 1, name, image))

	db_instance.execute("""
	INSERT INTO top_ten (publication_date, ranking, item, main_attribute) VALUES %s
	""" % ', '.join([
		'(%s)' % node for node in [
			', '.join(['"%s"' % item for item in items]) for items in sql_to_run
		]
	]))

	db_instance.commit()

	db_instance.close()


# TODO: Comment me
class NewWindow(tk.Toplevel):

	def __init__(self, title, *args, **kwargs):
		tk.Toplevel.__init__(self, *args, **kwargs)

		self.title(title)

		self.frame = tk.Frame(self)
		self.frame.grid(sticky=tk.NSEW)

	def render(self, render_fnc):
		render_fnc(self.frame)


# TODO: Comment me
def get_data():
	return [
		ListItem({
			"link": "https://www.themoviedb.org/movie?language=en-US",
			"name": "Popular Movies",
			"image": "https://wallpapers.wallhalla.com/5qko9XMuZqk_AAt1q4zzxwzN_d79089ac/aHR0cHM6Ly93d3cubW92aWVtYW5pYS5pby93YWxscGFwZXIvZG00dndsZDQ3Ni10aGUtcGVhbnV0cy1tb3ZpZQ==",
			"parser": parse_popular_movies
		}),
		ListItem({
			"link": "https://www.ariacharts.com.au/charts/singles-chart",
			"name": "Popular Music",
			"image": "https://wallpapers.wallhalla.com/9K8Avr3h0oD_4BIgx3Y_2145780b/aHR0cHM6Ly93YWxsLmFscGhhY29kZXJzLmNvbS9iaWcucGhwP2k9Njg1MTA4",
			"parser": parse_popular_music
		}),
		ListItem({
			"link": "https://store.steampowered.com/search/?sort_by=Released_DESC&filter=topsellers",
			"name": "Popular Games",
			"image": "https://wallpapers.wallhalla.com/y4EYX7I7q1_gQImG3x_946b790d/aHR0cHM6Ly93YWxsLmFscGhhY29kZXJzLmNvbS9iaWcucGhwP2k9NDQ4ODIx",
			"parser": parse_popular_games
		})
	]


# TODO: Comment
class App(tk.Frame):
	def __init__(self, parent, *args, **kwargs):
		tk.Frame.__init__(self, parent, *args, **kwargs)

		self.header = Header()
		self.body = Menu(self)


if __name__ == '__main__':
	root = tk.Tk()
	root.title("The Best Damn Thing")
	App(root).grid(sticky=tk.NSEW, padx=10, pady=(0, 20))
	root.mainloop()
