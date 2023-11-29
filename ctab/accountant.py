from dydx3.helpers.request_helpers import generate_now_iso
from backend import log, feed, listen
from pprint import pprint

class Accountant(object):
	def __init__(self):
		self.ws = None
		listen("clientReady", self.load)
		listen("affordable", self.affordable)

	def log(self, *msg):
		log("Accountant %s"%(" ".join([str(m) for m in msg]),))

	def load(self):
		if self.ws: return self.log("already loaded")
		self.log("loading!")
		self.ws = feed("dacc", generate_now_iso(),
			on_message=self.update)

	def update(self, msg):
		pprint(msg)

	def affordable(self, proposal):
		self.log("just saying yes")
		return True