from backend import log
from observer import Observer
from strategist import strategies

class Manager(object):
	def __init__(self, platform, symbol, strategist=None, strategy="rsi"):
		self.platform = platform
		self.symbol = symbol
		self.observer = Observer(platform, symbol, self.observe)
		self.strategist = strategist or strategies[strategy](symbol)
		# TODO: trader

	def log(self, *msg):
		log("Manager[%s:%s] %s"%(self.platform, self.symbol, " ".join(msg)))

	def tick(self):
		self.strategist.tick(self.observer.history)

	def observe(self, event):
		self.strategist.process(self.symbol, event, self.observer.history)