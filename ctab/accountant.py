from dydx3.helpers.request_helpers import generate_now_iso
from backend import log, feed, listen, stop
from pprint import pprint

class Accountant(object):
	def __init__(self):
		self.ws = None
		listen("clientReady", self.load)
		listen("affordable", self.affordable)

	def log(self, *msg):
		log("Accountant %s"%(" ".join([str(m) for m in msg]),))

	def affordable(self, proposal):
		self.log("just saying yes")
		return True

	def load(self):
		if self.ws: return self.log("already loaded")
		self.log("loading!")
		self.ws = feed("dacc", generate_now_iso(),
			on_message=self.on_message, on_error=self.on_error,
			on_open=self.on_open, on_close=self.on_close)

	def on_error(self, ws, msg):
		self.log("ERROR", msg)
		stop()

	def on_message(self, ws, msg):
		self.log("message:")
		pprint(msg)

	def on_close(self, ws, code, message):
		self.log("closed!!", code, message)

	def on_open(self, ws):
		self.log("open!")