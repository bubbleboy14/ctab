from .base import Base, INNER, OUTER

class Slosh(Base):
	def __init__(self, symbol, recommender=None):
		self.top, self.bottom = symbol
		self.ratios = {
			"current": None,
			"high": None,
			"low": None
		}
		self.averages = {
			"inner": None,
			"outer": None,
			"total": None
		}
		self.allratios = []
		self.histories = {}
		self.shouldUpdate = False
		Base.__init__(self, symbol, recommender)

	def ave(self, limit=None):
		rats = self.allratios[:limit]
		return sum(rats) / len(rats)

	def tick(self, history=None): # calc ratios (ignore history...)
		history = self.histories
		if not self.shouldUpdate:
			return print(".", end=" ", flush=True)
		self.shouldUpdate = False
		if self.top not in history or self.bottom not in history:
			return self.log("skipping tick (waiting for history)")
		cur = history[self.top]["current"] / history[self.bottom]["current"]
		self.allratios.append(cur)
		self.averages["total"] = self.ave()
		self.averages["inner"] = self.ave(INNER)
		self.averages["outer"] = self.ave(OUTER)
		if self.ratios["current"]:
			self.ratios["high"] = max(self.ratios["high"], cur)
			self.ratios["low"] = min(self.ratios["low"], cur)
		else:
			self.ratios["high"] = self.ratios["low"] = cur
		self.ratios["current"] = cur
		self.log("\n\n", self.ratios, "\n", self.averages, "\n\n")

	def compare(self, symbol, side, price, eobj, history):
		self.shouldUpdate = True
		self.log("compare", symbol, side, price)
		if symbol not in self.histories:
			self.histories[symbol] = {
				"all": []
			}
		symhis = self.histories[symbol]
		symhis["current"] = price
		symhis["all"].append(price)
		symhis["average"] = sum(symhis["all"])
		# TODO: high/low