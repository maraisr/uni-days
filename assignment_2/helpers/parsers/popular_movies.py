from functools import partial
from re import IGNORECASE, findall, compile


def parse(content: str):
	titles_regex = compile(r"<a\s.*(?=title\sresult)[^>]+>([^<]+)", IGNORECASE)
	images_regex = compile(r"<img\sclass=.poster.*(?=data-src)data-src=.([^'\"]+)", IGNORECASE)

	results = map(partial(findall, string=content), [titles_regex, images_regex])

	return list(zip(*results))
