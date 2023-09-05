from backend import log, rel, start
from strategist import strategies
from manager import Manager
from trader import Trader

class Office(object):
	def __init__(self, platform, symbols, strategy="rsi", globalStrategy=False, globalTrade=False):
		self.platform = platform
		self.symbols = symbols
		self.trader = globalTrade and Trader()
		trec = self.trader and self.trader.recommend
		strat = strategies[strategy]
		self.strategist = globalStrategy and strat(symbols, trec)
		self.managers = {}
		for symbol in symbols:
			self.managers[symbol] = Manager(platform, symbol,
				self.strategist or strat(symbol, trec), self.trader)
		self.log("initialized %s managers"%(len(symbols),))
		rel.timeout(1, self.tick)

	def log(self, *msg):
		log("Office[%s] %s"%(self.platform, " ".join(msg)))

	def tick(self):
		manStrat = manTrad = True
		if self.strategist:
			self.strategist.tick()
			manStrat = False
		if self.trader:
			self.trader.tick()
			manTrad = False
		if manStrat or manTrad:
			for manager in self.managers:
				self.managers[manager].tick(manStrat, manTrad)
		return True

if __name__ == "__main__":
	Office("dydx", ["BTC-USD", "ETH-USD"], "slosh", True, True)
#	Office("dydx", ["BTC-USD"])
#	Office("gemini", ["BTCUSD", "ETHUSD", "ETHBTC"])
	start()