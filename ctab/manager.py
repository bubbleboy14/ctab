from backend import log
from strategist import strategies
from observer import Observer
from trader import Trader

class Manager(object):
	def __init__(self, platform, symbol, strategist="rsi", trader=None):
		self.latest = {
			"price": None
		}
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
		if trad:
			self.trader.tick()
			self.review()

	def review(self):
		tz = self.trader.trades
		curprice = self.latest["price"]
		if not curprice:
			return self.log("skipping review (waiting for price)")
		if not tz:
			return self.log("skipping review (waiting for trades)")
		self.log("review %s trades - current price is %s"%(len(tz), curprice))
		for trade in tz:
			action = trade["action"]
			price = trade["price"]
			if action == "BUY":
				isgood = curprice > price
			else: # SELL
				isgood = curprice < price
			self.log("%s at %s - %s trade!"%(action,
				price, isgood and "GOOD" or "BAD"))

	def observe(self, event):
		self.latest["price"] = float(event["price"])
		self.strategist.process(self.symbol, event, self.observer.history)