from backend import getoffice
from agent import Agent

class Trader(object):
	def __init__(self, live=True):
		self.recommendations = []
		self.live = live
		self.trades = []
		self.agent = Agent()

	def log(self, *msg):
		print("\nTrader %s\n"%(" ".join([str(m) for m in msg]),))

	def note(self, recommendation):
		# TODO: wrap in timestamped object...?
		self.trades.append(recommendation)

	def recommend(self, recommendation):
		self.log("recommended:", recommendation)
		self.recommendations.append(recommendation)

	def shouldTrade(self, recommendation): # TODO: actually evaluate
		self.log("assessing recommendation:", recommendation)
		return getoffice("accountant").possible(recommendation)

	def trade(self, recommendation):
		self.log("\n\n\n", "TRADING", recommendation, "\n\n\n")
		self.note(recommendation)
		self.live and self.agent.trade(recommendation)

	def tick(self):
		# first rank in terms of payout
		for recommendation in self.recommendations:
			self.shouldTrade(recommendation) and self.trade(recommendation)
		self.recommendations = []
		# TODO: review trades[] (track wins/losses)