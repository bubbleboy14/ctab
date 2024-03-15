from cantools import db

class Fill(db.TimeStampedBase):
	market = db.String()
	amount = db.Float()
	price = db.Float()
	side = db.String()
	fee = db.Float()
	score = db.Float()
	order_id = db.String()
	client_order_id = db.String()