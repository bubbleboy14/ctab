from dydx3.helpers.request_helpers import generate_now_iso
from backend import listen
from base import Feeder

class Accountant(Feeder):
	def __init__(self):
		listen("clientReady", self.load)
		listen("affordable", self.affordable)

	def affordable(self, proposal):
		self.log("just saying yes")
		return True

	def load(self):
		self.feed("dacc", generate_now_iso())