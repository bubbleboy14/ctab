from dydx3 import Client, constants, epoch_seconds_to_iso
from web3 import Web3
from backend import log, remember, recall

PROVIDER = "http://localhost:7545"

class Agent(object):
	def __init__(self, stark=None):
		self.w3 = Web3(Web3.HTTPProvider(PROVIDER))
		self.stark = stark or recall("stark")
		self.client = self.buildClient()
		self.stark or self.onboard()
		self.account = self.client.private.get_account(
			ethereum_address=self.client.default_address
		).data['account']

	def log(self, *msg):
		log("Agent %s"%(" ".join([str(m) for m in msg]),))

	def onboard(self):
		self.log("onboarding")
		keymap = self.client.onboarding.derive_stark_key()
		self.stark = self.client.stark_private_key = keymap["private_key"]
		obresp = self.client.onboarding.create_user(
			stark_public_key=keymap["public_key"],
			stark_public_key_y_coordinate=keymap["public_key_y_coordinate"]
		)
		self.log(obresp.headers, "\n\n", obresp.data, "\n\n")
		self.log("created new stark key")
		if not input("should i save it? [Y/n] ").lower().startswith("n"):
			remember("stark", self.stark)

	def buildClient(self):
		clargs = {
			"web3": self.w3,
			"host": constants.API_HOST_GOERLI,
			"network_id": constants.NETWORK_ID_GOERLI
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

	#{'side': 'BUY', 'action': 'BUY', 'price': 26296.0, 'symbol': 'BTC-USD'}
	def trade(self, trade):
		self.log("TRADE!", trade)
		trargs = {
			"size": '10',
			"post_only": False,
			"limit_fee": '0.1',
			"price": trade['price'],
			"order_type": constants.ORDER_TYPE_LIMIT,
			"position_id": self.account['positionId'],
			"expiration": epoch_seconds_to_iso(time.time() + 61),
			"side": getattr(constants, "ORDER_SIDE_%s"%(action,)),
			"market": getattr(constants, "MARKET_%s_%s"%tuple(trade["symbol"].split("-")))
		}
		self.log("creating order:", trargs)
		self.client.private.create_order(**trargs)
