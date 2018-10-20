import tkinter as tk

from components.nav_item import NavItem
from data import get_data
from entities.list_item import ListItem


class Menu(tk.Frame):
	def __init__(self, parent, *args, **kwargs):
		tk.Frame.__init__(self, parent, *args, **kwargs)

		self.grid(row=1, column=2)

		self._data = get_data()

		self.render(
			map(lambda item: NavItem().setup(item), self._data)
		)

	def render(self, nav_items: [ListItem]):
		[
			item.render().grid(in_=self, row=0, column=idx, padx=10) \
			for (idx, item) in enumerate(nav_items)
		]
