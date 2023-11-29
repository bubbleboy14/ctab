from backend import log, stop

class Worker(object):
	def sig(self):
		return self.__class__.__name__

	def log(self, *msg):
		log("%s %s"%(self.sig(), " ".join([str(m) for m in msg])))

	def error(self, *msg):
		self.log(*msg)
		stop()