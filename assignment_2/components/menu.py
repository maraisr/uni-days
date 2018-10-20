import tkinter as tk

from components.nav_item import NavItem
from entities.list_item import ListItem
from helpers.parsers.popular_games import parse as parse_popular_games
from helpers.parsers.popular_movies import parse as parse_popular_movies
from helpers.parsers.popular_music import parse as parse_popular_music


class Menu(tk.Frame):
	def __init__(self, parent, *args, **kwargs):
		tk.Frame.__init__(self, parent, *args, **kwargs)

		self.grid(row=1, column=2)

		self._data = [
			ListItem({
				"link": "https://www.themoviedb.org/movie?language=en-US",
				"name": "Popular Movies",
				"parser": parse_popular_movies
			}),
			ListItem({
				"link": "https://www.ariacharts.com.au/charts/singles-chart",
				"name": "Popular Music",
				"parser": parse_popular_music
			}),
			ListItem({
				"link": "https://store.steampowered.com/search/?sort_by=Released_DESC&filter=topsellers",
				"name": "Popular Games",
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
