from entities.list_item import ListItem
from helpers.parsers.popular_games import parse as parse_popular_games
from helpers.parsers.popular_movies import parse as parse_popular_movies
from helpers.parsers.popular_music import parse as parse_popular_music


def get_data():
	return [
		ListItem({
			"link": "https://www.themoviedb.org/movie?language=en-US",
			"name": "Popular Movies",
			"parser": parse_popular_movies
		}),
		ListItem({
			"link": "https://www.ariacharts.com.au/charts/singles-chart",
			"name": "Popular Music",
			"parser": parse_popular_music
		}),
		ListItem({
			"link": "https://store.steampowered.com/search/?sort_by=Released_DESC&filter=topsellers",
			"name": "Popular Games",
			"parser": parse_popular_games
		})
	]
