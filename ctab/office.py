from backend import log, rel, start
from manager import Manager

class Office(object):
	def __init__(self, platform, symbols):
		self.platform = platform
		self.symbols = symbols
		self.managers = {}
		for symbol in symbols:
			self.managers[symbol] = Manager(platform, symbol)
		self.log("initialized %s managers"%(len(symbols),))
		rel.timeout(1, self.tick)

	def log(self, *msg):
		log("Office[%s] %s"%(self.platform, " ".join(msg)))

	def tick(self):
		for manager in self.managers:
			self.managers[manager].tick()
		return True

if __name__ == "__main__":
	Office("gemini", ["BTCUSD", "ETHUSD", "ETHBTC"])
	start()