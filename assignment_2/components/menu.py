import tkinter as tk

from components.nav_item import NavItem
from entities.list_item import ListItem
from helpers.parsers.popular_games import parse as parse_popular_games


class Menu(tk.Frame):
	def __init__(self, parent, *args, **kwargs):
		tk.Frame.__init__(self, parent, *args, **kwargs)

		self.grid(row=1, column=2)

		# TODO: Build this list from a db or something
		self._data = [
			ListItem({
				"link": "https://www.imdb.com/search/title?title_type=feature&genres=action&sort=moviemeter,asc",
				"name": "Popular Movies",
				"image": "TODO: IMAGE HERE",
				"parser": lambda content: print("popular movies")
			}),
			ListItem({
				"link": "https://www.ariacharts.com.au/charts/singles-chart",
				"name": "Popular Music",
				"image": "TODO: IMAGE HERE",
				"parser": lambda content: print("popular music")
			}),
			ListItem({
				"link": "https://store.steampowered.com/search/?sort_by=Released_DESC&filter=topsellers",
				"name": "Popular Games",
				"image": "TODO: IMAGE HERE",
				"parser": parse_popular_games
			})
		]

		self.render(
			map(lambda item: NavItem().setup(item), self._data)
		)

	def render(self, nav_items: [ListItem]):
		[
			item.render().grid(in_=self, row=0, column=idx, padx=10) \
			for (idx, item) in enumerate(nav_items)
		]
