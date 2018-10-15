import tkinter as tk

from components.preview import Preview
from entities.list_item import ListItem
from helpers.new_window import NewWindow


class NavItem(tk.Frame):
	def __init__(self, *args, **kwargs):
		tk.Frame.__init__(self, *args, **kwargs)

		self.config(relief=tk.SUNKEN, bd=2)

	def setup(self, list_item: ListItem):
		self._item = list_item

		self.image = "TODO: Image for item"
		self.name = self._item.getName()

		return self

	def _preview(self):
		# create a new window, then pass a lambda that renders a component in it
		NewWindow("Preview | %s" % self.name) \
			.render(lambda context: Preview(context, self._item))

	def _history(self):
		pass

	def _save(self):
		pass

	def render(self):
		tk.Label(self, text=self.image) \
			.grid(row=0, column=0, columnspan=2)

		# Heading row
		tk.Label(self, text=self.name, justify=tk.CENTER, anchor=tk.W) \
			.grid(row=1, column=0, columnspan=2)

		# Actions
		tk.Button(self, text="Preview", command=lambda: self._preview()) \
			.grid(row=3, column=0, rowspan=2)

		tk.Button(self, text="History", command=lambda: self._history()) \
			.grid(row=3, column=1)

		tk.Button(self, text="Save", command=lambda: self._save()) \
			.grid(row=4, column=1)

		return self
