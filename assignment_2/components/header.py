import tkinter as tk


class Header(tk.Frame):
	def __init__(self, *args, **kwargs):
		tk.Frame.__init__(self, *args, **kwargs)

		self.grid(pady=15)

		self.image = tk.PhotoImage(file="assets/logo.gif")

		tk.Label(self, image=self.image, justify=tk.CENTER) \
			.grid(row=0, column=0)
