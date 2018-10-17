import tkinter as tk
from functools import partial

from components.preview import Preview
from entities.list_item import ListItem, PREVIOUS, CURRENT
from helpers.new_window import NewWindow


class NavItem(tk.Frame):
	def __init__(self, *args, **kwargs):
		tk.Frame.__init__(self, *args, **kwargs)

		self.config(relief=tk.SUNKEN, bd=2)

		self.previous_current = tk.StringVar(self)
		self.previous_current.set(PREVIOUS)

	def setup(self, list_item: ListItem):
		self._item = list_item

		self.image = self._item.getImage()
		self.name = self._item.getName()

		return self

	def _preview(self, which: str):
		# create a new window, then pass a lambda that renders a component in it
		NewWindow("Preview | %s" % self.name) \
			.render(
			partial(Preview, list_item=self._item.getCurrent() if which == CURRENT else self._item.getPrevious()))

	def _export(self, which: str):
		pass

	def _save(self, which: str):
		pass

	def render(self):
		tk.Label(self, text=self.image) \
			.grid(row=0, column=0, columnspan=2)

		tk.Label(self, text=self.name, justify=tk.CENTER, anchor=tk.W) \
			.grid(row=1, column=0, columnspan=2)

		tk.Radiobutton(self, text="Previous", variable=self.previous_current, value=PREVIOUS) \
			.grid(row=3, column=0)
		tk.Radiobutton(self, text="Current", variable=self.previous_current, value=CURRENT) \
			.grid(row=3, column=1)

		tk.Button(self, text="Preview", command=lambda: self._preview(self.previous_current.get())) \
			.grid(row=4, column=0)

		tk.Button(self, text="Export", command=lambda: self._export(self.previous_current.get())) \
			.grid(row=4, column=1)

		tk.Button(self, text="Save", command=lambda: self._save(CURRENT)) \
			.grid(row=5, column=0, columnspan=2)

		return self
