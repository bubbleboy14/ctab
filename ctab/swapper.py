from rel.util import ask, listen
from mkswap.backend import setStaging, setCredSet
from mkswap.config import config as swapconfig
from mkswap import getOffice
from cantools.web import respond
from cantools.util import log
from cantools import config
from model import Fill

def filled(trade):
	fill = Fill()
	fill.balances = ask("balances", mode="actual")
	fill.client_order_id = trade["client_order_id"]
	fill.order_id = trade["order_id"]
	fill.market = trade["symbol"]
	fill.amount = trade["amount"]
	fill.price = trade["price"]
	fill.score = trade["score"]
	fill.side = trade["side"]
	fill.fee = trade["fee"]
	fill.put()

def response():
	log("initializing mkswap office", important=True)
	swobj = config.ctab.obj()
	presel = int(swobj["office"].pop("index"))
	swobj.pop("mon")
	swapconfig.set(swobj)
	setStaging()
	setCredSet()
	config.ctab.sub("live").update("office", getOffice(presel))
	listen("orderFilled", filled)
	log("office initialized")

respond(response)