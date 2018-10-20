from entities.list_item import ListItem
from helpers.parsers.popular_games import parse as parse_popular_games
from helpers.parsers.popular_movies import parse as parse_popular_movies
from helpers.parsers.popular_music import parse as parse_popular_music


def get_data():
	return [
		ListItem({
			"link": "https://www.themoviedb.org/movie?language=en-US",
			"name": "Popular Movies",
			"image": "https://wallpapers.wallhalla.com/5qko9XMuZqk_AAt1q4zzxwzN_d79089ac/aHR0cHM6Ly93d3cubW92aWVtYW5pYS5pby93YWxscGFwZXIvZG00dndsZDQ3Ni10aGUtcGVhbnV0cy1tb3ZpZQ==",
			"parser": parse_popular_movies
		}),
		ListItem({
			"link": "https://www.ariacharts.com.au/charts/singles-chart",
			"name": "Popular Music",
			"image": "https://wallpapers.wallhalla.com/9K8Avr3h0oD_4BIgx3Y_2145780b/aHR0cHM6Ly93YWxsLmFscGhhY29kZXJzLmNvbS9iaWcucGhwP2k9Njg1MTA4",
			"parser": parse_popular_music
		}),
		ListItem({
			"link": "https://store.steampowered.com/search/?sort_by=Released_DESC&filter=topsellers",
			"name": "Popular Games",
			"image": "https://wallpapers.wallhalla.com/y4EYX7I7q1_gQImG3x_946b790d/aHR0cHM6Ly93YWxsLmFscGhhY29kZXJzLmNvbS9iaWcucGhwP2k9NDQ4ODIx",
			"parser": parse_popular_games
		})
	]
