import tkinter as tk


class Header(tk.Frame):
	def __init__(self, *args, **kwargs):
		tk.Frame.__init__(self, *args, **kwargs)

		self.grid(pady=15, sticky=tk.W + tk.E)

		tk.Label(self, text="LOGO", justify=tk.CENTER) \
			.grid(row=0, column=0)

		tk.Label(self, text="Simply the Best", justify=tk.RIGHT) \
			.grid(row=0, column=1, sticky=tk.W)
