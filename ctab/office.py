from backend import log, rel, start
from strategist import strategies
from manager import Manager
from trader import Trader

class Office(object):
	def __init__(self, platform, symbols, strategist=None, trader=False):
		self.platform = platform
		self.symbols = symbols
		self.trader = trader and Trader()
		self.strategist = strategist and strategies[strategist](symbols,
			self.trader and self.trader.recommend)
		self.managers = {}
		for symbol in symbols:
			self.managers[symbol] = Manager(platform,
				symbol, self.strategist, self.trader)
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
	Office("dydx", ["BTC-USD", "ETH-USD"], "slosh", True)
#	Office("dydx", ["BTC-USD"])
#	Office("gemini", ["BTCUSD", "ETHUSD", "ETHBTC"])
	start()