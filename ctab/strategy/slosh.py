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

	def ave(self, limit=None, collection=None):
		rats = (collection or self.allratios)[:limit]
		return sum(rats) / len(rats)

	def swap(self, buysym, sellsym, size=10):
		hz = self.histories
		bcur = hz[buysym]["current"]
		scur = hz[sellsym]["current"]
		sellsize = size * scur / bcur
		self.recommender({
			"action": "SELL",
			"symbol": sellsym,
			"price": scur,
			"size": sellsize
		})
		self.recommender({
			"action": "BUY",
			"symbol": buysym,
			"price": bcur,
			"size": size
		})

	def hilo(self, cur):
		size = 0
		rz = self.ratios
		az = self.averages
		rz["current"] = cur
		if cur > rz["high"]:
			rz["high"] = cur
			size += 10
		elif cur < rz["low"]:
			rz["low"] = cur
			size -= 10
		for ave in ["inner", "outer", "total"]:
			if cur > az[ave]:
				size += 1
		for ave in ["inner", "outer", "total"]:
			if cur < az[ave]:
				size -= 1
		if not size: return
		if size > 0:
			self.swap(self.top, self.bottom, size)
		else:
			self.swap(self.bottom, self.top, size)

	def tick(self, history=None): # calc ratios (ignore history...)
		history = self.histories
		if not self.shouldUpdate:
			return# print(".", end=" ", flush=True)
		self.shouldUpdate = False
		if self.top not in history or self.bottom not in history:
			return self.log("skipping tick (waiting for history)")
		cur = history[self.top]["current"] / history[self.bottom]["current"]
		self.allratios.append(cur)
		self.averages["total"] = self.ave()
		self.averages["inner"] = self.ave(INNER)
		self.averages["outer"] = self.ave(OUTER)
		if self.ratios["current"]:
			self.hilo(cur)
		else:
			self.ratios["current"] = self.ratios["high"] = self.ratios["low"] = cur
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
		symhis["average"] = self.ave(collection=symhis["all"])
		# TODO: high/low