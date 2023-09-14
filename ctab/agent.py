from dydx3 import Client
from dydx3.constants import API_HOST_GOERLI
from dydx3.constants import NETWORK_ID_GOERLI
from web3 import Web3
from backend import log

PROVIDER = "http://localhost:7545"

class Agent(object):
	def __init__(self, stark=None):
		self.w3 = Web3(Web3.HTTPProvider(PROVIDER))
		self.stark = stark
		self.client = self.buildClient()
		self.stark or self.onboard()

	def log(self, *msg):
		log("Agent %s"%(" ".join([str(m) for m in msg]),))

	def onboard(self):
		self.log("onboarding")
		keymap = self.client.onboarding.derive_stark_key()
		self.stark = self.client.stark_private_key = keymap["private_key"]
		self.log(self.client.onboarding.create_user(
			stark_public_key=keymap["public_key"],
			stark_public_key_y_coordinate=keymap["public_key_y_coordinate"]
		))

	def buildClient(self):
		clargs = {
			"web3": self.w3,
			"host": API_HOST_GOERLI,
			"network_id": NETWORK_ID_GOERLI
		}
		self.stark = self.stark or input("stark key? ")
		if self.stark:
			clargs["stark_private_key"] = self.stark
		else:
			pk = input("private key? ")
			if pk:
				clargs["eth_private_key"] = pk
			else:
				clargs["default_ethereum_address"] = input("ok, public address? ")
		self.log("building client with clargs:", clargs)
		return Client(**clargs)

	def trade(self, recommendation):
		self.log("ACTUALLY DO THE TRADE!", recommendation)