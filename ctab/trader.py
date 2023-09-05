
class Trader(object):
	def __init__(self):
		self.recommendations = []

	def log(self, *msg):
		print("Trader %s"%(" ".join([str(m) for m in msg]),))

	def recommend(self, recommendation):
		self.recommendations.append(recommendation)

	def shouldTrade(self, recommendation):
		pass

	def trade(self, recommendation):
		pass

	def tick(self):
		# first rank in terms of payout
		for recommendation in self.recommendations:
			self.shouldTrade(recommendation) and self.trade(recommendation)
		self.recommendations = []