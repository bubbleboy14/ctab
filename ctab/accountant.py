from backend import log, feed, listen

class Accountant(object):
	def __init__(self, platform):
		# TODO : establish feed ... signature?
		#ws = feed(platform, ...)
		listen("affordable", self.affordable)

	def affordable(self, proposal):
		log("Accountant just saying yes")
		return True