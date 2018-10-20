from functools import partial
from re import IGNORECASE, findall, compile

from helpers.parsers._helpers import ALPHA


def parse(content: str):
	title_regex = compile(r"<span class=.title.>%s" % ALPHA, IGNORECASE)

	image_regex = compile(r"col\ssearch_capsule.*img\ssrc=['\"](.*)['\"]", IGNORECASE)

	results = map(partial(findall, string=content), [title_regex, image_regex])

	return list(zip(*results))
