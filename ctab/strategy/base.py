INNER = 10
OUTER = 40

class Base(object):
	def __init__(self, symbol):
		self.symbol = symbol

	def log(self, *msg):
		print("Strategist[%s:%s] %s"%(self.__class__.__name__,
			self.symbol, " ".join([str(m) for m in msg])))

	def process(self, symbol, event, history):
		self.compare(symbol, event["side"], float(event["price"]), event, history)