from dydx3.helpers.request_helpers import generate_now_iso
from backend import listen
from base import Feeder

defbals = {
	"ETH": 0.1,
	"BTC": 0.01,
	"USD": 1000
}

class Accountant(Feeder):
	def __init__(self, balances=defbals):
		self.balances = balances
		listen("clientReady", self.load)
		listen("affordable", self.affordable)

	def affordable(self, prop):
		s = prop.get("size", 10)
		v = s / prop["price"]
		bz = self.balances
		sym = prop["symbol"].split("-")[0]
		self.log("balances", bz)
		if prop["action"] == "BUY":
			if s > bz["USD"]:
				self.log("not enough USD!")
				return False
			bz["USD"] -= s
			bz[sym] += v
		else:
			if v > bz[sym]:
				self.log("not enough %s!"%(sym,))
				return False
			bz["USD"] += s
			bz[sym] -= v
		self.log("trade approved!")
		return True

	def load(self):
		self.feed("dacc", generate_now_iso())