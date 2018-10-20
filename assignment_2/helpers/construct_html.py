import os
from urllib.request import pathname2url

from entities.list_item import Item

TEMPLATE = """

<html>

	<head>
		<title>%s</title>
		<link rel="stylesheet" href="http://stackpath.bootstrapcdn.com/bootstrap/4.1.3/css/bootstrap.min.css">
	</head>
	
	<body>
		<div class="container">
			%s
		</div>
	</body

</html>

"""


def construct_html(list_item: Item):
	_heading = """
		<h1 class="display-4">%s</h1>
		""" % list_item.getName()

	filepath = "downloads/%s" % list_item.getFilename()
	_filename = "<p>Filename: <i><a href='%s' target='_blank'>%s</a></i></p>" % (
		('file:%s' % pathname2url(os.path.abspath(filepath))),
		("downloads/%s" % list_item.getFilename())
	)

	_date = "<p>Date published: <i>%s</i></p>" % list_item.getAge().strftime("%d/%m/%Y")

	# TODO: Source image here
	_image = "<p><img src='%s' /></p>" % "http://placekitten.com/g/300/300"

	_top_ten_row_template = "<tr><td>%s</td><td>%s</td><td><img src='%s' /></td></tr>"
	_top_ten = """
		<table class="table">
			<thead>
				<tr>
					<th>Position</th>
					<th>Name</th>
					<th>Image</th>
				</tr>
			</thead>
			<tbody>
				%s
			</tbody>
		</table>
	""" % ''.join([
		_top_ten_row_template % (idx + 1, name, image) for (idx, (name, image)) in enumerate(list_item.getItems())
	])

	return TEMPLATE % (
		list_item.getName(),
		('</br>'.join([_heading, _filename, _date, _image]) + '</hr>' + _top_ten)
	)
