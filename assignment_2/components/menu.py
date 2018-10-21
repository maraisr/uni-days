import tkinter as tk

from components.nav_item import NavItem
from data import get_data
from entities.list_item import ListItem


# @description
# A component render class that houses the logic for our menu, the three frames you'll find visually. This extends the
# tkinter Frame widget.
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
		[
			item.render().grid(in_=self, row=0, column=idx, padx=10) \
			for (idx, item) in enumerate(nav_items)
		]
