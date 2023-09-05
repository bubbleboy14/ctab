from backend import log
from strategist import strategies
from observer import Observer
from trader import Trader

class Manager(object):
	def __init__(self, platform, symbol, strategist=None, trader=None, strategy="rsi"):
		self.platform = platform
		self.symbol = symbol
		self.trader = trader or Trader()
		self.observer = Observer(platform, symbol, self.observe)
		self.strategist = strategist or strategies[strategy](symbol)
		self.strategist.setRecommender(trader.recommend)

	def log(self, *msg):
		log("Manager[%s:%s] %s"%(self.platform, self.symbol, " ".join(msg)))

	def tick(self, strat=True, trad=True):
		strat and self.strategist.tick(self.observer.history)
		trad and self.trader.tick()

	def observe(self, event):
		self.strategist.process(self.symbol, event, self.observer.history)