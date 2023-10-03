from backend import log
from strategist import strategies
from observer import Observer
from trader import Trader

class Manager(object):
	def __init__(self, platform, symbol, reviewer, strategist="rsi", trader=None):
		self.latest = {
			"price": None
		}
		self.platform = platform
		self.symbol = symbol
		self.reviewer = reviewer
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
		if trad:
			self.trader.tick()
			self.review()

	def review(self):
		self.reviewer(symbol=self.symbol)

	def observe(self, event):
		self.latest["price"] = float(event["price"])
		self.strategist.process(self.symbol, event, self.observer.history)