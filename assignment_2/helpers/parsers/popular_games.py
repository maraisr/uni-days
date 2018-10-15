def parse(content: str):
	for item in _get_game_row(content):
		print("item: %s" % item)

	return "test"


def _get_game_row(content: str):
	return ["test"]
