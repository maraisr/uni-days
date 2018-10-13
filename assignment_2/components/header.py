import tkinter as tk


class Header(tk.Frame):
	def __init__(self, parent, *args, **kwargs):
		tk.Frame.__init__(self, parent, *args, **kwargs)

		self.pack(side="top", fill="x")

		self.logo = tk.Label(self, text="Simply the Best")
		self.logo.pack()
