# -----Statement of Authorship----------------------------------------#
#
#  This is an individual assessment item.  By submitting this
#  code I agree that it represents my own work.  I am aware of
#  the University rule that a student must not act in a manner
#  which constitutes academic dishonesty as stated and explained
#  in QUT's Manual of Policies and Procedures, Section C/5.3
#  "Academic Integrity" and Section E/2.1 "Student Code of Conduct".
#
#    Student no: n8911495
#    Student name: Petrus Marais Rossouw
#
#  NB: Files submitted without a completed copy of this statement
#  will not be marked.  Submitted files will be subjected to
#  software plagiarism analysis using the MoSS system
#  (http://theory.stanford.edu/~aiken/moss/).
#
# --------------------------------------------------------------------#


# -----Assignment Description-----------------------------------------#
#
#  The Best, Then and Now
#
#  In this assignment you will combine your knowledge of HTMl/XML
#  mark-up languages with your skills in Python scripting, pattern
#  matching, and Graphical User Interface design to produce a useful
#  application that allows the user to preview and print lists of
#  top-ten rankings.  See the instruction sheet accompanying this
#  file for full details.
#
# --------------------------------------------------------------------#

import tkinter as tk

from components.header import Header
from components.menu import Menu


# TODO:
# [x] you select a "old" saved copy and preview it (heading, as a tk.Label, and a numbered list)
# [x] you select a "live" copy and preview it (heading, as a tk.Label, and a numbered list)
# [x] you get to export either a live, or previous copy (html export)
# [x] get a logo in there
# [x] get all the images working
# [x] popular music parser written
# [x] popular movies parser written
# [x] you could current the live copy to a sqlite db
# [x] you could previous the live copy to a sqlite db
# [ ] An image characterising the list, downloaded from online when the generated HTML document is viewed (i.e., not from a local file on the host computer).
# [ ] code cleanup
# [ ] comment everything
# [x] rename entry to "the_best.py"
# [ ] check that all things are done for the assignment
# [ ] (maybe) The publication date for the list, extracted from the source document (not just the date when the file was downloaded because they may not be the same).

class App(tk.Frame):
	def __init__(self, parent, *args, **kwargs):
		tk.Frame.__init__(self, parent, *args, **kwargs)

		self.header = Header()
		self.body = Menu(self)


if __name__ == '__main__':
	root = tk.Tk()
	root.title("The Best Damn Thing")
	App(root).grid(sticky=tk.NSEW, padx=10, pady=(0, 20))
	root.mainloop()
