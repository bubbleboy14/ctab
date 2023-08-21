from cantools.util import log
from observer import Observer
from strategist import Strategist

class Manager(object):
	def __init__(self, platform, symbol):
		self.platform = platform
		self.symbol = symbol
		self.observer = Observer(platform, symbol, self.observe)
		self.strategist = Strategist(symbol)
		# TODO: trader

	def log(self, *msg):
		log("Manager[%s:%s] %s"%(self.platform, self.symbol, " ".join(msg)))

	def tick(self):
		self.strategist.rsi(self.observer.history)

	def observe(self, event):
		self.strategist.process(event, self.observer.history)