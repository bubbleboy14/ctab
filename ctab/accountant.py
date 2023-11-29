from dydx3.helpers.request_helpers import generate_now_iso
from backend import feed, listen
from base import Feeder

class Accountant(Feeder):
	def __init__(self):
		self.ws = None
		listen("clientReady", self.load)
		listen("affordable", self.affordable)

	def affordable(self, proposal):
		self.log("just saying yes")
		return True

	def load(self):
		if self.ws: return self.log("already loaded")
		self.log("loading!")
		self.ws = feed("dacc", generate_now_iso(),
			on_message=self.on_message, on_error=self.on_error,
			on_open=self.on_open, on_close=self.on_close)