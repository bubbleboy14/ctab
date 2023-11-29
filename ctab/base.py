from pprint import pprint
from backend import log, stop

class Worker(object):
	def sig(self):
		return self.__class__.__name__

	def log(self, *msg):
		log("%s %s"%(self.sig(), " ".join([str(m) for m in msg])))

	def error(self, *msg):
		self.log("ERROR", *msg)
#		stop()

class Feeder(Worker):
	def on_error(self, ws, msg):
		self.error(msg)

	def on_message(self, ws, msg):
		self.log("message:")
		pprint(msg)

	def on_close(self, ws, code, message):
		self.log("closed!!", code, message)

	def on_open(self, ws):
		self.log("opened!!")