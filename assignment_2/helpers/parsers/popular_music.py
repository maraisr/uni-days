from functools import partial
from re import IGNORECASE, findall, compile

from helpers.parsers._helpers import ALPHA


def parse(content: str):
	song_name = compile(r"<div\sclass=.item-title[^>]+>%s" % ALPHA, IGNORECASE)
	artist_name = compile(r"<div\sclass=.artist-name[^>]+>%s" % ALPHA, IGNORECASE)

	image_regex = compile(r"<img\ssrc=.(?=[^\"']+coverart)([^\"']+)", IGNORECASE)

	(song_names, artist_names, images) = list(
		map(partial(findall, string=content), [song_name, artist_name, image_regex])
	)

	# Now we need to zip the song_name and the artist_name in a str

	return list(zip(
		map(
			lambda node: "%s - %s" % node,
			zip(song_names, artist_names)
		),
		images
	))
