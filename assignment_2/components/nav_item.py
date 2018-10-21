import os
import tkinter as tk
import webbrowser
from functools import partial
from urllib.request import pathname2url
from uuid import uuid4

from components.preview import Preview
from entities.list_item import ListItem, PREVIOUS, CURRENT
from helpers.construct_html import construct_html
from helpers.db import save_to_db
from helpers.new_window import NewWindow


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

		filename = "downloads/temp/%s.html" % uuid4()
		tempfile = open(filename, "x")  # x == write mode
		tempfile.write(html)
		tempfile.close()

		# opens this file in the operating systems default browser.
		webbrowser.open('file:%s' % pathname2url(os.path.abspath(filename)))

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
