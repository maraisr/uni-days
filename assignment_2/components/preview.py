import tkinter as tk

from entities.list_item import ListItem

class Preview(tk.Frame):
	def __init__(self, container, list_item:ListItem, *args, **kwargs):
		tk.Frame.__init__(self, container, *args, **kwargs)

		self.pack(expand=1, fill=tk.BOTH)