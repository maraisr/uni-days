from sqlite3 import connect

from entities.list_item import Item


def save_to_db(list_item: Item):
	db_instance = connect("top_ten.db")

	sql_to_run = []
	for (key, (name, image)) in enumerate(list_item.getItems()):
		sql_to_run.append((list_item.getAge().strftime("%d/%m/%Y"), key + 1, name, image))

	db_instance.execute("""
	INSERT INTO top_ten (publication_date, ranking, item, main_attribute) VALUES %s
	""" % ', '.join([
		'(%s)' % node for node in [
			', '.join(['"%s"' % item for item in items]) for items in sql_to_run
		]
	]))

	db_instance.commit()

	db_instance.close()
