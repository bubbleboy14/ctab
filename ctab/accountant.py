from backend import log, feed

class Accountant(object):
	def __init__(self, platform):
		# TODO : establish feed ... signature?
		#ws = feed(platform, ...)
		pass

	def possible(self, proposal):
		log("Accountant just saying yes")
		return True