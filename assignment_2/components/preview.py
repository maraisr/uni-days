import tkinter as tk

from entities.list_item import Item


class Preview(tk.Frame):
	def __init__(self, container, list_item: Item, *args, **kwargs):
		tk.Frame.__init__(self, container, *args, **kwargs)

		self.pack(expand=1, fill=tk.BOTH)

		tk.Label(self, text=list_item.getImage()) \
			.grid(row=0, column=0, rowspan=2)

		# TODO: Style me
		tk.Label(self, text=list_item.getName()) \
			.grid(row=0, column=1)

		preview_list = tk.Frame(self)
		preview_list.grid(row=1, column=1)

		for (idx, (name, image)) in enumerate(list_item.getItems()):
			tk.Label(preview_list, text="[%s] %s" % (idx + 1, name)).grid(row=idx, column=0, sticky=tk.W)
