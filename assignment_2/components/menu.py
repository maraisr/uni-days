import tkinter as tk

from entities.list_item import ListItem


class Menu(tk.Frame):
	def __init__(self, parent, *args, **kwargs):
		tk.Frame.__init__(self, parent, *args, **kwargs)

		self.pack(side="bottom", fill=tk.BOTH, expand=1)

		self.logo = False  # TODO: Fill me

		self._data = [
			ListItem({
				"link": "https://www.imdb.com/search/title?title_type=feature&genres=action&sort=moviemeter,asc",
				"name": "Popular Movies"
			})
		]

		self.nav = map(lambda item: NavItem(item), self._data)

		self.render()

	def render(self):
		pass


# UI Element
class NavItem(tk.Frame):
	def __init__(self, item):
		tk.Frame.__init__(self)

		self._item = item

		self.image = False
		self.name = item.getName()
