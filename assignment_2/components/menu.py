import tkinter as tk

from entities.list_item import ListItem
from components.menu_item import NavItem

class Menu(tk.Frame):
	def __init__(self, parent, *args, **kwargs):
		tk.Frame.__init__(self, parent, *args, **kwargs)

		self.grid(row=1, column=2)

		# TODO: Build this list from a db or something
		self._data = [
			ListItem({
				"link": "https://www.imdb.com/search/title?title_type=feature&genres=action&sort=moviemeter,asc",
				"name": "Popular Movies",
				"parser": lambda: print("popular movies")
			}),
			ListItem({
				"link": "https://www.ariacharts.com.au/charts/singles-chart",
				"name": "Popular Music",
				"parser": lambda: print("popular music")
			}),
			ListItem({
				"link": "https://store.steampowered.com/search/?filter=topsellers",
				"name": "Popular Games",
				"parser": lambda: print("popular games")
			})
		]

		self.nav = map(lambda item: NavItem().setup(item), self._data)

		self.render()

	def render(self):
		for (key, item) in enumerate(self.nav):
			item.render() \
				.grid(in_=self, row=0, column=key, padx=10)

