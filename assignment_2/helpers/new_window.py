import tkinter as tk


class NewWindow(tk.Toplevel):

	def __init__(self, title, *args, **kwargs):
		tk.Toplevel.__init__(self, *args, **kwargs)

		self.title(title)

		self.frame = tk.Frame(self)
		self.frame.grid(sticky=tk.N + tk.S + tk.E + tk.W)

	def render(self, render_fnc):
		render_fnc(self.frame)
