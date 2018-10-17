from functools import partial
from re import IGNORECASE, findall, compile


def parse(content: str):
	title_regex = compile(r"<span class=.title.>([a-z,0-9®™:\s-]+)", IGNORECASE)

	image_regex = compile(r"col\ssearch_capsule.*img\ssrc=['\"](.*)['\"]", IGNORECASE)

	results = map(partial(findall, string=content), [title_regex, image_regex])

	return list(zip(*results))
