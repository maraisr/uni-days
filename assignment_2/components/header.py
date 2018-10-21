import tkinter as tk


# @description
# A UI component render class that houses the logic for our header, which extends the tkinter Frame widget.
class Header(tk.Frame):
	def __init__(self, *args, **kwargs):
		tk.Frame.__init__(self, *args, **kwargs)

		# Renders the header as is in time of initialization.
		self.grid(pady=15)

		# tkinter's PhotoImage losses its image, when its not defined to a method that get's garbage collected, so
		# keep this reference on this class, so we have it until we destruct this header.
		#   Small gotcha with PhotoImage
		self.logo_definition = tk.PhotoImage(file="assets/logo.gif")

		tk.Label(self, image=self.logo_definition, justify=tk.CENTER) \
			.grid(row=0, column=0)
