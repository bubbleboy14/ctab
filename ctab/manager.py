from backend import log
from strategist import strategies
from observer import Observer
from trader import Trader

class Manager(object):
	def __init__(self, platform, symbol, strategist="rsi", trader=None):
		self.platform = platform
		self.symbol = symbol
		self.trader = trader or Trader()
		setrec = not trader
		self.observer = Observer(platform, symbol, self.observe)
		if type(strategist) == str:
			self.strategist = strategies[strategist](symbol)
			setrec = True
		else:
			self.strategist = strategist
		setrec and self.strategist.setRecommender(self.trader.recommend)

	def log(self, *msg):
		log("Manager[%s:%s] %s"%(self.platform, self.symbol, " ".join(msg)))

	def tick(self, strat=True, trad=True):
		strat and self.strategist.tick(self.observer.history)
		trad and self.trader.tick()

	def observe(self, event):
		self.strategist.process(self.symbol, event, self.observer.history)