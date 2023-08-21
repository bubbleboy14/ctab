from backend import log, events, feed, spew, stop

LOG = True

class Observer(object):
	def __init__(self, platform, symbol, observe=spew, use_initial=False):
		self.symbol = symbol
		self.observe = observe
		self.use_initial = use_initial
		self.history = {
			"ask": [],
			"bid": [],
			"w_average": [],
			"1_w_average": []
		}
		self._log_file = open(symbol + ".log", "w")
		ws = feed(platform, symbol,
			on_message=self.on_message, on_error=self.error,
			on_open=self.on_open, on_close=self.on_close)

	def log(self, *msg):
		line = " ".join([str(m) for m in msg])
		self._log_file.write(line + "\n")
		if LOG:
			log("Observer[%s] %s"%(self.symbol, line))

	def error(self, *msg):
		self.log("ERROR", *msg)
		stop()

	def on_message(self, ws, message):
		for event in events(message):
			if event.get("type") != "change" or not event.get("side"):
				return self.log("skipping", event)
			if self.use_initial or event.get("reason") != "initial":
				self.observe(event)

	def on_close(self, ws):
		self.log("closed!!")

	def on_open(self, ws):
		self.log("opened!!")
